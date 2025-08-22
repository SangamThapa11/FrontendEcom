
import logo from "../assets/images/logo.png"
import { PageTitle } from "../components/PageSection";
import LoginForm from "./auth/LoginForm";
import HorizontalDivider from "../components/divider/HorizontalDivider";

const LandingPage = () => {
  
  return (
    <>
    <div className=" flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
        <div className="flex lg:hidden justify-center">
          <img src={logo} alt="" className="w-30 rounded-full"/>
        </div>
             <PageTitle title="Sign In here!" className="text-green-950"></PageTitle>

           <HorizontalDivider dividerText=""/>
            <LoginForm />
            <HorizontalDivider dividerText="Or"/>
            <p className="text-sm italic text-center">
              Don't have an account? {"     "}
              <a href="/register" className="font-light text-teal-700 italic text-sm hover:underline hover:cursor-pointer hover:text-teal-800 hover:font-normal transition hover:scale-97">
                Register here !
                </a> 
            </p>
      </div>
    </>
  );
}; 
export default LandingPage; 