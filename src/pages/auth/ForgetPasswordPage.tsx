import logo from "../../assets/images/logo.jpg"
import { PageTitle } from "../../components/PageSection";
const ForgetPasswordPage = () => {
    return (<>
  
      <div className=" flex flex-col gap-10 mt-30 lg:mt-40 border border-green-50/15 bg-green-50 mx-2 lg:mx-10 shadow-lg rounded-md p-5">
        <div className="flex lg:hidden justify-center">
          <img src={logo} alt="" className="w-30 rounded-full"/>
        </div>
             <PageTitle title="Forget Password" className="text-green-950"></PageTitle>
             <hr className="border-t-2 border-t-teal-200/50"/>
            <form action="" className="flex flex-col gap-5">

              <div className="flex w-full">
                <div className="flex w-2/5"></div>
                <div className="flex w-3/5 gap-5">
                  <button type="reset" className="w-full bg-red-800 py-2 text-white font-semibold rounded-lg hover:bg-red-900 transition hover:cursor-pointer hover-scale-98">
                    Set Password
                    </button>
                  <button type="submit" className="w-full bg-teal-800 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition hover:cursor-pointer hover-scale-98">
                    Login
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
              Already have an account? {"     "}
              <a href="/" className="font-light text-teal-700 italic text-sm hover:underline hover:cursor-pointer hover:text-teal-800 hover:font-normal transition hover:scale-97">
                Login here !
                </a> 
            </p>
      </div>
  
     
    
    </>)
}
export default ForgetPasswordPage; 