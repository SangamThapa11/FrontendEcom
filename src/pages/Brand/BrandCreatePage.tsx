import { useForm } from "react-hook-form";
import { FileUpload, GeneralInput, SelectOption } from "../../components/form/input"
import ListPageHeader from "../../components/listing-page/ListHeader"
import { isFeatured, Status } from "../../config/constants";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import brandService from "../../services/brand.service";
import { useNavigate } from "react-router";
import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";

export interface IBrandCreateDataType {
    _id: string,
    name: string | null; 
    status: Status; 
    isFeatured: isFeatured;
    logo: any
}
const BrandCreateData = Yup.object({
    name: Yup.string().min(2).max(100).required(), 
    status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE),
    isFeatured: Yup.boolean().default(false),
    logo: Yup.mixed().required()
})
const BrandCreatePage = () => {
    const navigate = useNavigate()
    const {control, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm<IBrandCreateDataType>({
        defaultValues: {
            name: "",
            status: Status.INACTIVE,
            isFeatured: isFeatured.FALSE, 
            logo: null
        },
        resolver: yupResolver(BrandCreateData) as any 
    })
    const submitForm = async (data: IBrandCreateDataType) => {
        try {
            console.log("Submitting:", data);
            await brandService.addBrand(data);
            toast.success("Brand Created!")
            navigate('/admin/brand')
        }catch(exception: any | unknown) { 
            toast.error("Sorry!", {
                description: "Brand cannot be created at this moment. Please try again later."
            })
        }
        }
    return (<>
    <div className="flex flex-col w-full gap-5">
        <ListPageHeader
          pageTitle="Brand Create"
        />
        <div className="felx flex-col gap-5">
            <div className="w-full">
                <form action="" onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
                    <div className="flex w-full">
                        <label htmlFor="name" className="w-1/3">Name:</label>
                                        <div className="flex flex-col gap-1 w-2/3">
                                          <GeneralInput
                                            name="name"
                                            control={control}
                                            errMsg={errors?.name?.message}
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
                                    <label htmlFor="isFeatured" className="w-1/3">isFeatured:</label>
                                    <div className="flex flex-col gap-1 w-2/3">
                                      <SelectOption
                                        name="isFeatured"
                                        control={control}
                                        errMsg={errors?.isFeatured?.message}
                                        options={[
                                          { label: "True", value: "true" },
                                          { label: "False", value: "false" }
                                        ]}
                                      />
                                    </div>
                    </div>

                    <div className="flex w-full">
                                    <label htmlFor="logo" className="w-1/3">Logo:</label>
                                    <div className="flex flex-col gap-1 w-2/3">
                                      <FileUpload
                                        name="logo"
                                        control={control}
                                        errMsg={errors?.logo?.message as string}
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
    </>)
}

export default BrandCreatePage