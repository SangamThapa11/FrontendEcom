import { useForm } from "react-hook-form"
import ListPageHeader from "../../components/listing-page/ListHeader"
import { FileUpload, GeneralInput, SelectOption } from "../../components/form/input"
import { InputType, Status } from "../../config/constants"
import { CancelButton, SubmitButton } from "../../components/form/FormButton"
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai"
import bannerService from "../../services/banner.service"
import { toast } from "sonner"
import { useNavigate, useParams } from "react-router"
import type { IBannerCreateDataType } from "./BannerCreatePage"
import { useCallback, useEffect, useState } from "react"
import { Spin } from "antd"
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"

const BannerEditData = Yup.object({
    title: Yup.string().min(3).max(100).required(), 
    url: Yup.string().url().nullable().default(null),
    status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE), 
    image: Yup.mixed().nullable().optional().default(null), 
})
const BannerEditPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [thumbUrl, setThumbUrl] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);
    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<IBannerCreateDataType>({
        defaultValues: {
            title: "",
            url: "",
            status: Status.INACTIVE,
            image: null,
        },
        resolver: yupResolver(BannerEditData) as any 
    })
    const submitForm = async (data: IBannerCreateDataType) => {
        console.log(data);
         
    try {
      console.log("Submitting:", data);
      await bannerService.updateBanner(params.id as string, data);
      toast.success("Banner Updated!!!", {
        description: "Congratulations! Banner has been updated successfully!!!"
      })
      navigate('/admin/banner')
      // eslint-disable-next-line 
    } catch (exception: any | unknown) {
      toast.error("Sorry!", {
        description: "Banner cannot be updated at this moment. Please try again later!!!"
      })
    }
      
    }
    const getBannerDetail = useCallback(async () => {
        try {
            const response = await bannerService.getBannerById(params.id as string)
            setValue("title", response.data.title);
            setValue("url", response.data.url);
            setValue("status", response.data.status);
            //setValue("image", response.data.image.thumbUrl);
            setThumbUrl(response.data.image.thumbUrl);

        } catch {
            toast.error("Error fetching detail!!", { description: "Error while fetching banner detail...." })
            navigate('/admin/banner')
        } finally {
            setLoading(false);
        }
    }, [params]);
    useEffect(() => {
        // data fetch
        getBannerDetail();
    }, [getBannerDetail])


    return (
        <>
            <div className="flex flex-col w-full gap-5">
                <ListPageHeader pageTitle="Banner Edit" />

                <div className="flex flex-col gap-5">
                    <div className="w-full">
                        {
                            loading ? (
                                <div className="flex h-96 w-full items-center justify-center">
                                    <Spin>Loading...</Spin>
                                </div>
                            ) : <>
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
                                        <div className="flex gap-1 w-2/3">
                                            <div className="flex w-full">
                                                <FileUpload
                                                    name="image"
                                                    control={control}
                                                    errMsg={errors?.image?.message as string}
                                                />
                                            </div>
                                            {
                                                thumbUrl ? <div className="flex w-1/3">
                                                    <img src={thumbUrl} alt="" className="w-full"/>
                                                </div> : <></>
                                            }
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
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )

}
export default BannerEditPage; 