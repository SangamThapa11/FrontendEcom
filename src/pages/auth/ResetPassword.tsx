import { Flex } from "antd";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordInput } from "../../components/form/input";
import { PageTitle } from "../../components/PageSection";
import authSvc from "../../services/auth.service";

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verifiedToken, setVerifiedToken] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: yupResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
  const verifyToken = async () => {
    if (!token) {
      console.error("No token found in URL");
      toast.error("Invalid reset link - no token provided");
      setIsVerifying(false);
      return;
    }

    console.log("Token from URL:", token);

    try {
      setIsVerifying(true);
      console.log("Calling verifyForgetToken API with token:", token);
      
      const response = await authSvc.verifyForgetToken(token);
      console.log("API Response:", response.data);
      
      // Use the token from response (should be the same as input)
      setVerifiedToken(response.data.data.verifyToken);
      setIsTokenVerified(true);
      toast.success("Reset link verified successfully");
      
    } catch (error: any) {
      console.error("Token verification error:", error);
      console.error("Error response:", error.response);
      
      const errorMessage = error.response?.data?.message || "Invalid or expired reset link";
      toast.error(errorMessage);
      setIsTokenVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  verifyToken();
}, [token]);

  const submitForm = async (data: ResetPasswordFormData) => {
    if (!isTokenVerified || !verifiedToken) {
      toast.error("Please verify your token first");
      return;
    }

    try {
      await authSvc.resetPassword(verifiedToken, data.password);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Password reset failed";
      toast.error(errorMessage);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
        <PageTitle title="Reset Password" className="text-green-950" />
        <hr className="border-t-2 border-t-teal-200/50" />
        <div className="flex justify-center items-center py-10">
          <div className="text-lg">Verifying reset link...</div>
        </div>
      </div>
    );
  }

  if (!isTokenVerified) {
    return (
      <div className="flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
        <PageTitle title="Reset Password" className="text-green-950" />
        <hr className="border-t-2 border-t-teal-200/50" />
        <div className="flex flex-col items-center py-10 gap-5">
          <div className="text-lg text-red-600">Invalid or expired reset link</div>
          <button
            onClick={() => navigate("/forget-password")}
            className="bg-teal-800 px-6 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
      <PageTitle title="Reset Password" className="text-green-950" />
      <hr className="border-t-2 border-t-teal-200/50" />

      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
        <Flex align="center">
          <label htmlFor="password" className="w-2/5 text-sm font-medium">
            New Password:
          </label>
          <Flex className="w-3/5 flex-col">
            <PasswordInput
              name="password"
              control={control}
              errMsg={errors?.password?.message}
            />
          </Flex>
        </Flex>

        <Flex align="center">
          <label htmlFor="confirmPassword" className="w-2/5 text-sm font-medium">
            Confirm Password:
          </label>
          <Flex className="w-3/5 flex-col">
            <PasswordInput
              name="confirmPassword"
              control={control}
              errMsg={errors?.confirmPassword?.message}
            />
          </Flex>
        </Flex>

        <Flex>
          <div className="flex w-2/5"></div>
          <Flex className="w-3/5 gap-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-red-800 py-2 text-white font-semibold rounded-lg hover:bg-red-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-800 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition disabled:opacity-70"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Flex>
        </Flex>
      </form>
    </div>
  );
};

export default ResetPasswordPage;