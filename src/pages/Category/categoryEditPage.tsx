import ListPageHeader from "../../components/listing-page/ListHeader";
import * as Yup from "yup";
import { Status } from "../../config/constants";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import { Spin } from "antd";
import { FileUpload, GeneralInput, SelectOption } from "../../components/form/input";
import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import type { ICategoryDataType } from "./categoryCreatePage";


interface ICategoryData {
    _id: string;
    name: string;
    status: Status;
    isFeatured: boolean;
    inMenu: boolean;
    brands: string[];
    image: string | null;
}

interface IBrandOption {
    label: string;
    value: string;
}

const CategoryEditData = Yup.object({
    name: Yup.string().min(2).max(100).required(),
    status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE),
    isFeatured: Yup.boolean().default(false),
    inMenu: Yup.boolean().default(false),
    brands: Yup.array().of(Yup.string()).nullable().default(null),
    image: Yup.mixed().nullable(),
});

const CategoryEditPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [brandOptions, setBrandOptions] = useState<IBrandOption[]>([]);

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ICategoryDataType>({
        defaultValues: {
            name: "",
            status: Status.INACTIVE,
            isFeatured: false,
            inMenu: false,
            brands: [],
            image: null,
        },
        resolver: yupResolver(CategoryEditData) as any,
    });

    const submitForm = async (data: ICategoryDataType) => {
        try {
            console.log("Submitting: ", data);
            await categoryService.updateCategory(params.id as string, data)
            toast.success("Category Updated!");
            navigate("/admin/category");
        } catch (exception: any) {
            toast.error("Sorry!", {
                description: exception.message || "Category cannot be updated at this moment. Please try again later.",
            });
        }
    };

    const loadBrands = useCallback(async () => {
        try {
            const response = await brandService.getAllBrands({
                page: 1,
                limit: 1000,
            });

            const options = response.data.map((brand: { _id: string; name: string }) => ({
                label: brand.name,
                value: brand._id,
            }));
            setBrandOptions(options);
        } catch (error) {
            console.error("Failed to load brands", error);
            toast.error("Failed to load brand data");
        }
    }, []);

    const getCategoryDetail = useCallback(async () => {
        try {
            const response = await categoryService.getCategoryById(params.id as string)
            // Set form values
            setValue("name", response.data.name);
            setValue("status", response.data.status);
            setValue("isFeatured", response.data.isFeatured);
            setValue("inMenu", response.data.inMenu);
            setValue("brands", response.data.brands || []);
            setValue("image", response.data.image);

            await loadBrands();
        } catch (error) {
            console.error("Failed to load category", error);
            toast.error("Failed to load category data");
            navigate("/admin/category");
        } finally {
            setLoading(false);
        }
    }, [params, navigate, setValue, loadBrands]);

    useEffect(() => {
        getCategoryDetail();
    }, [getCategoryDetail]);

    return (
        <div className="flex flex-col w-full gap-5">
            <ListPageHeader pageTitle="Edit Category" />
            <div className="flex flex-col gap-5">
                <div className="w-full">
                    {loading ? (
                        <div className="flex h-96 w-full items-center justify-center">
                            <Spin>Loading...</Spin>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-5">
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
                                <label htmlFor="inMenu" className="w-1/3">inMenu:</label>
                                <div className="flex flex-col gap-1 w-2/3">
                                    <SelectOption
                                        name="inMenu"
                                        control={control}
                                        errMsg={errors?.inMenu?.message}
                                        options={[
                                            { label: "True", value: "true" },
                                            { label: "False", value: "false" }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="flex w-full">
                                <label htmlFor="brands" className="w-1/3">Brands:</label>
                                <div className="flex flex-col gap-1 w-2/3">
                                    <Controller
                                        name="brands"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={brandOptions}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                isClearable
                                                isSearchable
                                                placeholder="Select brands..."
                                                value={brandOptions.filter(option =>
                                                    field.value?.includes(option.value)
                                                )}
                                                onChange={(selected) => {
                                                    field.onChange(selected ? selected.map(option => option.value) : []);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.brands && (
                                        <span className="text-red-500 text-sm">{errors.brands.message}</span>
                                    )}
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryEditPage;