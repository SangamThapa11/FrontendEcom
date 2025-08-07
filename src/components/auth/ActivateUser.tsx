import { Spin } from "antd"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import authSvc from "../../services/auth.service"

const ActivateUser = () => {
    const params = useParams()
    const navigate = useNavigate();

    const activateUserProfile  = async () => {
        try{
            await authSvc.activateUserProfile(params.token as string)
            toast.success("Thank you for registering!!!", {
                description: "Your account has been activated successfully. Please login to continue..."
            })
        }catch{
            toast.error("Error while activating!!", {
                description: "Sorry! There was problem while activating your profile. Please try after sometimes."
            })
        } finally {
            navigate("/")
        }
    }
    useEffect(() => {
        activateUserProfile()
    }, [])
    return (
    <>
    <Spin fullscreen /> 

    </>
    )
}

export default ActivateUser