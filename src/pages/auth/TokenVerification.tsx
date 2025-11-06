import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import { PageTitle } from "../../components/PageSection";
import logo from "../../assets/images/Logo.png";

const TokenVerificationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("No verification token found");
        setIsVerifying(false);
        toast.error("Invalid reset link");
        return;
      }

      try {
        
        const decodedToken = decodeURIComponent(token);
        console.log("Verifying token:", decodedToken);
        
        await authSvc.verifyForgetToken(decodedToken);
        setIsVerified(true);
        toast.success("Token verified successfully!");
        
       
        setTimeout(() => {
          navigate(`/reset-password?token=${encodeURIComponent(decodedToken)}`);
        }, 2000);
        
      } catch (exception: any) {
        console.error("Token verification error:", exception);
        const errorMessage = exception.response?.data?.message || "Token verification failed";
        setError(errorMessage);
        toast.error("Verification failed", {
          description: errorMessage,
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
      <div className="flex lg:hidden justify-center">
        <img src={logo} alt="Logo" className="w-30 rounded-full" />
      </div>

      <PageTitle title="Verifying Token" className="text-green-950" />
      <hr className="border-t-2 border-t-teal-200/50" />

      <div className="flex flex-col items-center gap-5 py-10">
        {isVerifying && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800"></div>
            <p className="text-gray-700">Verifying your token...</p>
          </>
        )}

        {!isVerifying && isVerified && (
          <>
            <div className="text-green-600 text-6xl">✓</div>
            <p className="text-green-800 font-semibold">Token verified successfully!</p>
            <p className="text-gray-600">Redirecting to password reset page...</p>
          </>
        )}

        {!isVerifying && error && (
          <>
            <div className="text-red-600 text-6xl">✗</div>
            <p className="text-red-800 font-semibold">Verification Failed</p>
            <p className="text-gray-600 text-center">{error}</p>
            
            <button
              onClick={() => navigate("/forget-password")}
              className="mt-4 bg-teal-800 px-6 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition"
            >
              Request New Link
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenVerificationPage;