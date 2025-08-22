import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EmailInput } from "../../components/form/input";
import { PageTitle } from "../../components/PageSection";
import authSvc from "../../services/auth.service";
import type { ICredentials } from "./LoginForm";
import logo from "../../assets/images/Logo.png";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICredentials>({
    defaultValues: { email: "" }
  });

  const submitForm = async (credentials: ICredentials) => {
    try {
      await authSvc.forgetPasswordRequest(credentials.email);
      toast.success("Reset link sent!", {
        description: "A password reset link has been sent to your email."
      });
    } catch (exception: any) {
      console.error(exception);
      const errorMessage = exception.response?.data?.message || "Error sending reset link";
      
      toast.error("Request failed", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
      <div className="flex lg:hidden justify-center">
        <img src={logo} alt="Logo" className="w-30 rounded-full" />
      </div>

      <PageTitle title="Reset Password" className="text-green-950" />
      <hr className="border-t-2 border-t-teal-200/50" />

      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
        <div className="flex w-full items-center">
          <label htmlFor="email" className="w-2/5 text-sm font-medium">
            Email Address:
          </label>
          <div className="flex w-3/5">
            <EmailInput
              name="email"
              control={control}
              errMsg={errors?.email?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <div className="flex w-2/5"></div>
          <div className="flex w-3/5 gap-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-red-800 py-2 text-white font-semibold rounded-lg hover:bg-red-900 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-teal-800 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </form>

      <span className="flex items-center">
        <span className="h-px flex-1 bg-gray-300"></span>
        <span className="shrink-0 px-4 text-gray-900">OR</span>
        <span className="h-px flex-1 bg-gray-300"></span>
      </span>

      <p className="text-sm italic text-center">
        Remember your password?{" "}
        <a
          href="/"
          className="font-light text-teal-700 italic text-sm hover:underline hover:text-teal-800 hover:font-normal transition"
        >
          Login here!
        </a>
      </p>
    </div>
  );
};

export default ForgetPasswordPage;