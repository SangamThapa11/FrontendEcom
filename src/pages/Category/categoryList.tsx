import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { Status, type IImageType, type IPaginationParams } from "../../config/constants";
import { Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import categoryService from "../../services/category.service";
import { toast } from "sonner";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import brandService from "../../services/brand.service";
import type { IBrandData } from "../Brand/brandList";

export interface ICategoryData {
    _id: string,
    name: string;
    status: Status;
    isFeatured: boolean;
    inMenu: boolean;
    brands: string[],
    image: IImageType;
}

interface IBrandMap {
    [key: string]: string;
}

const CategoryListPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [brandMap, setBrandMap] = useState<IBrandMap>({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
        total: 0,
    });

    // Load all brands to map IDs to names
    const loadBrands = async () => {
        try {
            const response = await brandService.getAllBrands({
                page: 1,
                limit: 1000 // Fetch all brands
            }) as unknown as AxiosSuccessResponse;
            console.log('Brands response:', response);
            
            const map: IBrandMap = {};
            response.data.forEach((brand: { _id: string, name: string }) => {
                map[brand._id] = brand.name;
            });
            setBrandMap(map);
        } catch (error) {
            console.error("Failed to load brands", error);
            toast.error("Failed to load brand data");
        }
    };

    const TableColumns = [
        {
            key: "name",
            title: "Name",
            dataIndex: "name"
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (val: Status) => (val === Status.ACTIVE ? <span className="text-teal-700">Publish</span> : <span className="text-red-700">Un-Publish</span>)
        },
        {
            key: "brands",
            title: "Brands",
            dataIndex: "brands",
            render: (brands: IBrandData[]) => (
                <div className="flex flex-wrap gap-1">
                    {brands?.map(brandId => {
                        return <span key={brandId._id} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {brandId.name || 'Unknown Brand'}
                        </span>
                    })}
                </div>
            )
        },
        {
            key: "image",
            title: "Image",
            dataIndex: "image",
            render: (val: string) => <img src={val} alt="Category" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "50%" }} />
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "_id",
            render: (val: string) => {
                return (<>
                    <div className="flex gap-1">
                        <div className="flex bg-teal-800 w-10 h-10  rounded-full items-center justify-center hover:bg-teal-900 transition hover:scale-96">
                            <NavLink to={'/admin/category/' + val} className={'text-white!'} >
                                <AiOutlineEdit className="w-5 h-5" />
                            </NavLink>
                        </div>
                        <div className="flex bg-red-800 w-10 h-10 rounded-full items-center justify-center hover:cursor-pointer  hover:bg-red-900 transition hover:scale-96">
                            <Popconfirm
                                title="Are you sure?"
                                description="Once deleted, it cannot be reverted back!"
                                okText="Confirm"
                                onConfirm={() => {
                                    deleteUser(val)
                                }}
                            >
                                <button className={'text-white! hover:cursor-pointer'}>
                                    <AiOutlineDelete className="w-5 h-5" />
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                </>)
            }
        }
    ];

    const deleteUser = async (categoryId: string) => {
        setLoading(true)
        try {
            await categoryService.deleteCategoryById(categoryId)
            await loadCategoryData({ page: 1, limit: 5 });
            toast.success("Category Deleted!!!")
        } catch {
            toast.error("Category cannot be Deleted!!!")
        } finally {
            setLoading(false);
        }
    }

    const [data, setData] = useState<Array<ICategoryData>>([])
    const [search, setSearch] = useState<string>('');

    const loadCategoryData = async ({ page = 1, limit = 5, search = null }: IPaginationParams) => {
        try {
            const response = await categoryService.getAllCategory({
                page: page,
                limit: limit,
                search: search
            }) as unknown as AxiosSuccessResponse
            setData(response.data)
            setPagination({
                current: response.options.pagination.page,
                pageSize: response.options.pagination.limit,
                total: response.options.pagination.total
            })
        } catch {
            toast.error("Cannot fetch category data", {
                description: "Category data cannot be loaded at this moment. Please try again later."
            })
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBrands();
        loadCategoryData({ page: 1, limit: 5, search: null });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadCategoryData({
                page: 1,
                limit: 5,
                search: search
            });
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [search])

    return (<>
        <div className="flex flex-col w-full gap-5">
            <ListPageHeader
                pageTitle="Category List"
                btnUrl="/admin/category/create"
                btnTxt={<><AiOutlinePlus /> <span>Add Category</span></>}
            />
            <div className="flex flex-col gap-5">
                <div className="w-full lg:w-1/3">
                    <Input.Search
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        size="large" />
                </div>
            </div>
            <div className="w-full">
                <Table
                    columns={TableColumns}
                    dataSource={data}
                    pagination={{
                        ...pagination,
                        onChange: async (page: number, pageSize: number) => {
                            await loadCategoryData({ page, limit: pageSize })
                        }
                    }}
                    loading={loading}
                />
            </div>
        </div>
    </>)
}

export default CategoryListPage;