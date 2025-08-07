import logo from "../../assets/images/logo.jpg"
import backgroundVideo from "../../assets/videos/bc.mp4"
import { PageTitle } from "../PageSection";
interface IAuthSidePanelProps {
  title: string, 
  subtitle: string, 
  description: string
}
const AuthSidePanel = ({title, subtitle, description}: Readonly<IAuthSidePanelProps>) => {
    return (
        <>
        <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute min-w-full min-h-full w-auto h-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover brightness-60 contrast-90">
                <source src={backgroundVideo} type="video/mp4" />
                <div className="w-full h-full bg-gray-950"></div>
            </video>
           <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col gap-10 justify-center items-center w-full">
        <img src={logo} alt="" className="w-30 rounded-full"/>
      <div className="flex flex-col text-center gap-8 mx-4">
        <PageTitle title={title} className="text-white"></PageTitle>

        <h2 className="text-white text-3xl font-semibold">{subtitle}{" "}</h2>

        <p className="text-white mx-8">
          {description}
        </p>
      </div>
      </div>
      </>
    );
}
export default AuthSidePanel; 