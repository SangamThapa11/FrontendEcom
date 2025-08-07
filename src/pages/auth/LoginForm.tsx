import { Flex } from "antd";
import { useForm } from "react-hook-form";
import { EmailInput, PasswordInput } from "../../components/form/input";
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";
import { useAuth, type UserProfile } from "../../context/AuthContext";
import { useNavigate } from "react-router";


export interface ICredentials {
  email: string,
  password: string
}
const LoginDTO = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required()
})

const LoginForm = () => {
  const { setLoggedInUser } = useAuth()
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors } } = useForm<ICredentials>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(LoginDTO)
  })
  const submitForm = async (credentials: ICredentials) => {
    try {
      const response = await authSvc.loginUser(credentials)
      //document.cookie = `accessToken=${response.data.accessToken}; expires=${new Date(Date.now()+86400000)};`
      localStorage.setItem("token_43", response.data.accessToken)
      localStorage.setItem("refresh_43", response.data.refreshToken)

      const LoggedInUser = await authSvc.getLoggedInUser()
      setLoggedInUser(LoggedInUser.data as UserProfile)

      toast.success("Welcome to" + LoggedInUser.data.role + " panel!!", {
        description: "You are now accessing " + LoggedInUser.data.role + " Panel....."
      })
      //socket.open()
      //socket.emit("loggedIn", {LoggedInUser: LoggedInUser})
      navigate('/' + LoggedInUser.data.role)
    } catch {
      toast.error("Error while login!!", {
        description: "Cannot login at this moment. Check your credentials before submission."
      })
    }
  }
  console.log(errors)

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
        <Flex>
          <label htmlFor="email" className="w-2/5 text-lg font-semibold">UserName (Email): </label>
          <Flex className="w-3/5 flex flex-col">
            <EmailInput
              name="email"
              control={control}
              errMsg={errors?.email?.message}
            />
          </Flex>
        </Flex>

        <Flex>
          <label htmlFor="password" className="w-2/5 text-lg font-semibold">Password: </label>
          <Flex className="w-3/5 flex flex-col">
            <PasswordInput
              name="password"
              control={control}
              errMsg={errors?.password?.message}
            />
          </Flex>
        </Flex>

        <Flex className="flex w-full justify-end">
          <a href="/forget-password" className="font-light text-teal-700 italic text-sm hover:underline hover:cursor-pointer hover:text-teal-800 hover:font-normal transition hover:scale-97">
            Forget Password
          </a>
        </Flex>

        <Flex>
          <div className="flex w-2/5"></div>
          <Flex className="w-3/5 gap-5">
            <button type="reset" className="w-full bg-red-800 py-2 text-white font-semibold rounded-lg hover:bg-red-900 transition hover:cursor-pointer hover-scale-98">
              Reset
            </button>
            <button type="submit" className="w-full bg-teal-800 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition hover:cursor-pointer hover-scale-98">
              Login
            </button>
          </Flex>
        </Flex>

      </form>
    </>
  )
}
export default LoginForm;