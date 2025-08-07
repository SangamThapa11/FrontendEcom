import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { Input, Popconfirm, Table } from "antd";
import { Status, type IImageType, type IPaginationParams } from "../../config/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import brandService from "../../services/brand.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import { NavLink } from "react-router";

export interface IBrandData {
    _id: string;
    name: string;
    status: Status;
    logo: IImageType;
    createdAt: Date | string,
    updatedAt: Date | string,
}

const BrandList = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
        total: 0,
    })
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
            key: "logo",
            title: "Logo",
            dataIndex: "logo",
            render: (val: string) => <img src={val} alt="Brand" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: "50%" }} />
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "_id",
            render: (val: string) => {
                return (<>
                    <div className="flex gap-1">
                        <div className="flex bg-teal-800 w-10 h-10  rounded-full items-center justify-center hover:bg-teal-900 transition hover:scale-96">
                            <NavLink to={'/admin/brand/' + val} className={'text-white!'} >
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

    const deleteUser = async (brandId: string) => {
        setLoading(true)
        try {
            await brandService.deleteBrandById(brandId)
            await loadBrandData({ page: 1, limit: 5 });
            toast.success("Brand Deleted!!!")
        } catch {
            toast.error("Brand cannot be Deleted!!!")
        } finally {
            setLoading(false);
        }
    }

    const [data, setData] = useState<Array<IBrandData>>([])
    const [search, setSearch] = useState<string>('');
    const loadBrandData = async ({ page = 1, limit = 4, search = null }: IPaginationParams) => {
        setLoading(true)
        try {
            const response = await brandService.getAllBrands({
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
            toast.error("Cannot fetch brand data", {
                description: "Brand data cannot be loaded at this moment. Please try again later."
            })
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadBrandData({ page: 1, limit: 4, search: null })
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBrandData({
                page: 1,
                limit: 4,
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
                pageTitle="Brand List"
                btnUrl="/admin/brand/create"
                btnTxt={<><AiOutlinePlus /> <span>Add Brand</span></>}
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
                            await loadBrandData({ page, limit: pageSize })
                        }
                    }}
                    loading={loading}
                />
            </div>
        </div>
    </>)
}

export default BrandList;