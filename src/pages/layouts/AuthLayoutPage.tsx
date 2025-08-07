import { Navigate, Outlet, useMatches } from "react-router"
import AuthSidePanel from "../../components/auth/AuthSidePanel"
import { useAuth } from "../../context/AuthContext"

export interface IAuthOutletContextType {
    title: string,
    subtitle: string,
    description: string  
}
const AuthLayoutPage = () => {
    const {loggedInUser} = useAuth() 

    const matches = useMatches()
    const currentHandle = matches.reverse().find((matchData) => matchData.handle)?.handle as IAuthOutletContextType
    console.log(currentHandle)

    if(loggedInUser){
        return <Navigate to={"/" + loggedInUser.role} />
    }else {
        return (
    <>
    <div className="flex w-full h-screen">
     <div className="hidden lg:flex w-2/5 h-screen relative">  
      <AuthSidePanel 
        {...currentHandle}
      />
      </div>

      <div className="flex flex-col w-full lg:w-3/5 bg-gray-50 h-screen">
         <Outlet />
      </div>
    </div>
    </>
    );
    }
    
};
export default AuthLayoutPage;