import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";
import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { FileUpload, GeneralInput, SelectOption } from "../../components/form/input";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { Status } from "../../config/constants";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import Select from 'react-select';
import { Controller } from 'react-hook-form';

export interface ICategoryDataType {
  _id: string;
  name: string | null;
  status: Status;
  isFeatured: boolean;
  inMenu: boolean;
  parentId: string;
  brands: string[] | null;
  image: any;
}

interface IBrandOption {
  label: string;
  value: string;
}
interface ICategoryOption {
  label: string;
  value: string;
}

const CategoryCreateData = Yup.object({
  name: Yup.string().min(2).max(100).required(),
  status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE),
  isFeatured: Yup.boolean().default(false),
  inMenu: Yup.boolean().default(false),
  parentId: Yup.string().optional().default(null),
  brands: Yup.array().of(Yup.string()).nullable().default(null),
  image: Yup.mixed().required("Image is required"),
});

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const [brandOptions, setBrandOptions] = useState<IBrandOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const loadBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = (await brandService.getAllBrands({
        page: 1,
        limit: 1000,
      })) as unknown as AxiosSuccessResponse;

      const options = response.data.map((brand: { _id: string; name: string }) => ({
        label: brand.name,
        value: brand._id,
      }));
      setBrandOptions(options);
    } catch (error) {
      console.error("Failed to load brands", error);
      toast.error("Failed to load brand data");
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },

  } = useForm<ICategoryDataType>({
    defaultValues: {
      name: "",
      status: Status.INACTIVE,
      isFeatured: false,
      inMenu: false,
      parentId: "",
      brands: [],
      image: null,
    },
    resolver: yupResolver(CategoryCreateData) as any,
  });

  const submitForm = async (data: ICategoryDataType) => {
    console.log("Submitting data:", data);
    try {
      await categoryService.addCategory(data);
      toast.success("Category Created!");
      navigate("/admin/category");
    } catch (exception: any) {
      toast.error("Sorry!", {
        description:
          exception.message ||
          "Category cannot be created at this moment. Please try again later.",
      });
    }
  };

  const [categoryOptions, setCategoryOptions] = useState<ICategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = (await categoryService.getAllCategory({
        page: 1,
        limit: 1000,
      })) as unknown as AxiosSuccessResponse;

      const options = response.data.map((category: { _id: string; name: string }) => ({
        label: category.name,
        value: category._id,
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load category data");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadBrands();
    loadCategories(); // Add this
  }, []);

  return ( <>
    <div className="flex flex-col w-full gap-5">
      <ListPageHeader pageTitle="Category Create" />
      <div className="felx flex-col gap-5">
        <div className="w-full">
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
              <label htmlFor="parentId" className="w-1/3">Parent Category:</label>
              <div className="flex flex-col gap-1 w-2/3">
                <Controller
                  name="parentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { label: "No Parent (Top Level)", value: "" },
                        ...categoryOptions
                      ]}
                      className="basic-select"
                      classNamePrefix="select"
                      isClearable
                      isSearchable
                      isLoading={loadingCategories}
                      placeholder="Select parent category..."
                      value={categoryOptions.find(option => option.value === field.value) || null}
                      onChange={(selected) => {
                        field.onChange(selected ? selected.value : "");
                      }}
                    />
                  )}
                />
                {errors.parentId && (
                  <span className="text-red-500 text-sm">{errors.parentId.message}</span>
                )}
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
                      isLoading={loadingBrands}
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
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryCreatePage;