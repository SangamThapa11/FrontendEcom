import { useForm } from "react-hook-form"
import ListPageHeader from "../../components/listing-page/ListHeader"
import { FileUpload, GeneralInput, SelectOption } from "../../components/form/input"
import { InputType, Status } from "../../config/constants"
import { CancelButton, SubmitButton } from "../../components/form/FormButton"
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai"
import bannerService from "../../services/banner.service"
import { toast } from "sonner"
import { useNavigate } from "react-router"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"

export interface IBannerCreateDataType {
  title: string | null;
  url: string | null;
  status: Status;
  image: any
}
const BannerCreateData = Yup.object({
    title: Yup.string().min(3).max(100).required(), 
    url: Yup.string().url().nullable().default(null),
    status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE), 
    image: Yup.mixed().required(), 
})

const BannerCreatePage = () => {
  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<IBannerCreateDataType>({
    defaultValues: {
      title: "",
      url: "",
      status: Status.INACTIVE,
      image: null,
    },
    resolver: yupResolver(BannerCreateData) as any 
  })
  const submitForm = async (data: IBannerCreateDataType) => {
    try {
      console.log("Submitting:", data);
      await bannerService.addBanner(data);
      toast.success("Banner Created!!!", {
        description: "Congratulations! Banner has been created successfully!!!"
      })
      navigate('/admin/banner')
      // eslint-disable-next-line 
    } catch (exception: any | unknown) {
      toast.error("Sorry!", {
        description: "Banner cannot be created at this moment. Please try again later!!!"
      })
    }
  }
  
    
  return (
    <>
      <div className="flex flex-col w-full gap-5">
        <ListPageHeader
          pageTitle="Banner Create"
        />

        <div className="flex flex-col gap-5">
          <div className="w-full">
            <form action="" onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
              <div className="flex w-full">
                <label htmlFor="title" className="w-1/3">Title:</label>
                <div className="flex flex-col gap-1 w-2/3">
                  <GeneralInput
                    name="title"
                    control={control}
                    errMsg={errors?.title?.message}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <label htmlFor="url" className="w-1/3">Link:</label>
                <div className="flex flex-col gap-1 w-2/3">
                  <GeneralInput
                    name="url"
                    type={InputType.URL}
                    control={control}
                    errMsg={errors?.url?.message}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <label htmlFor="status" className="w-1/3">Status:</label>
                <div className="flex flex-col gap-1 w-2/3">
                  <SelectOption
                    name="status"
                    control={control}
                    errMsg={errors?.status?.message}
                    options={[
                      { label: "Publish", value: "active" },
                      { label: "Un-Publish", value: "inactive" }
                    ]}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <label htmlFor="image" className="w-1/3">Image:</label>
                <div className="flex flex-col gap-1 w-2/3">
                  <FileUpload
                    name="image"
                    control={control}
                    errMsg={errors?.image?.message as string}
                  />
                </div>
              </div>

              <div className="flex w-full">
                <div className="w-1/3"></div>
                <div className="flex gap-1 w-2/3">
                  <CancelButton disabled={isSubmitting}>
                    <AiOutlineUndo /> <span>Reset</span>
                  </CancelButton>
                  <SubmitButton disabled={isSubmitting}>
                    <AiOutlineSend /> <span>Submit</span>
                  </SubmitButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default BannerCreatePage