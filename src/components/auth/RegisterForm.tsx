import { useForm } from "react-hook-form";
import { EmailInput, FileUpload, PasswordInput, RadioOption, SelectOption, TextAreaInput, TextInput } from "../../components/form/input";
import { yupResolver } from "@hookform/resolvers/yup"
import authSvc from "../../services/auth.service";
import { type IRegisterData, RegisterDefaultValues, RegisterDTO } from "../../pages/auth/auth.contract";
import { toast } from "sonner";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import { useNavigate } from "react-router";



const RegisterFormComponent = () => {
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue, setError } = useForm<IRegisterData>({
    defaultValues: RegisterDefaultValues as IRegisterData,
    resolver: yupResolver(RegisterDTO) as any
  })
  const submitForm = async (data: IRegisterData) => {
    //api server call 
    try {
      await authSvc.registerUser(data) as unknown as AxiosSuccessResponse;
      toast.success("Register Success", { description: 'Please check your email for further activation process...' })
      navigate('/')
    } catch (exception: any) {
      if (exception.code === 400) {
        Object.keys(exception.error.error).map((field) => {
          setError(field as keyof IRegisterData, { message: exception.error.error[field] })
        })
      }
      toast.error("Cannot Register!!!", {
        description: "Please try again later..."
      })
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-3">
        <div className="flex w-full">
          <label htmlFor="name" className="w-2/5">Full name:</label>
          <div className="flex w-3/5 flex-col">
            <TextInput
              name="name"
              control={control}
              errMsg={errors?.name?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="email" className="w-2/5">Email (username):</label>
          <div className="flex w-3/5 flex-col">
            <EmailInput
              name="email"
              control={control}
              errMsg={errors?.email?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="password" className="w-2/5">Password:</label>
          <div className="flex w-3/5 flex-col">
            <PasswordInput
              name="password"
              control={control}
              errMsg={errors?.password?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="confirmPassword" className="w-2/5">Re-Password:</label>
          <div className="flex w-3/5 flex-col">
            <PasswordInput
              name="confirmPassword"
              control={control}
              errMsg={errors?.confirmPassword?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="Role" className="w-2/5">Role:</label>
          <div className="flex w-3/5">
            <SelectOption
              name="role"
              control={control}
              errMsg={errors?.role?.message}
              options={[
                { label: "Buyer", value: "customer" },
                { label: "Seller", value: "seller" }
              ]}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="gender" className="w-2/5">Gender:</label>
          <div className="flex w-3/5">
            <RadioOption
              name="gender"
              control={control}
              errMsg={errors?.gender?.message}
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" }
              ]}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="Address" className="w-2/5">Address:</label>
          <div className="flex w-3/5">
            <TextAreaInput
              name="address"
              control={control}
              errMsg={errors?.address?.message}
            />
          </div>
        </div>

        <div className="flex w-full">
          <label htmlFor="Phone" className="w-2/5">Phone:</label>
          <div className="flex w-3/5">
            <TextInput
              name="phone"
              control={control}
              errMsg={errors?.phone?.message}
            />
          </div>
        </div>

        <div className="flex w-full ">
          <label htmlFor="Image" className="w-2/5">Image:</label>
          <div className="flex w-3/5">
            <FileUpload
              name="image"
              setValue={(name: string, value: File) => setValue(name as any, value)}
              control={control}
              errMsg={errors?.image?.message as string}
            />
          </div>
        </div>


        <div className="flex w-full">
          <div className="flex w-2/5"></div>
          <div className="flex w-3/5 gap-3">
            <button type="reset" disabled={isSubmitting} className="disabled:bg-red-800/30 disabled:cursor-not-allowed w-full bg-red-800 py-2 text-white font-semibold rounded-lg hover:bg-red-900 transition hover:cursor-pointer hover-scale-98">
              Reset
            </button>

            <button type="submit" disabled={isSubmitting} className="disabled:bg-teal-800/30 disabled:cursor-not-allowed w-full bg-teal-800 py-2 text-white font-semibold rounded-lg hover:bg-teal-900 transition hover:cursor-pointer hover-scale-98">
              Register
            </button>
          </div>
        </div>

      </form>
    </>)
}

export default RegisterFormComponent