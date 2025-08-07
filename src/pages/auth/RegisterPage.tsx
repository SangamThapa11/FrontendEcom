import logo from "../../assets/images/logo.jpg"
import { PageTitle } from "../../components/PageSection";
import HorizontalDivider from "../../components/divider/HorizontalDivider";
import RegisterFormComponent from "../../components/auth/RegisterForm";


const RegisterPage = () => {
  
  return (
    <>
     <div className=" flex flex-col gap-3 mt-5 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
            <div className="flex lg:hidden justify-center">
              <img src={logo} alt="" className="w-30 rounded-full" />
            </div>
            <PageTitle title="Register Now!" className="text-green-950"></PageTitle>
            <HorizontalDivider dividerText="" />
            <RegisterFormComponent />
            <HorizontalDivider dividerText="Or" />
            <p className="text-sm italic text-center">
              Already have an account? {"     "}
              <a href="/" className="font-light text-teal-700 italic text-sm hover:underline hover:cursor-pointer hover:text-teal-800 hover:font-normal transition hover:scale-97">
                Login here !
              </a>
            </p>
          </div>
    </>
  );
};
export default RegisterPage; 