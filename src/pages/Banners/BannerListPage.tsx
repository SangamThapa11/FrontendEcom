import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { type IImageType, type IPaginationParams } from "../../config/constants";
import { Status } from "../../config/constants";
import { toast } from "sonner";
import bannerService from "../../services/banner.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import { NavLink } from "react-router";

export interface IBannerData {
    _id: string;
    title: string,
    url: string,
    image: IImageType,
    status: Status,
    createdAt: Date | string,
    updatedAt: Date | string
}
const BannerListPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
        total: 0,
    })
    const [data, setData] = useState<Array<IBannerData>>([]);

    const [search, setSearch] = useState<string>('');

    const TableColumns = [
        {
            key: "title",
            title: "Title",
            dataIndex: "title"
        },
        {
            key: "url",
            title: "Link",
            dataIndex: "url",
            render: (val: string) => <a target="_banner" href={val}>{val}</a>
        },
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (val: Status) => (val === Status.ACTIVE ? <span className="text-teal-700">Publish</span> : <span className="text-red-700">Un-Publish</span>)
        },
        {
            key: "image",
            title: "Image",
            dataIndex: "image",
            render: (val: IImageType) => <img src={val.thumbUrl} className="w-full h-18 object-cover" />
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "_id",
            render: (val: string) => {
                return (<>
                    <div className="flex gap-1">
                        <div className="flex bg-teal-800 w-10 h-10  rounded-full items-center justify-center hover:bg-teal-900 transition hover:scale-96">
                            <NavLink to={'/admin/banner/' + val} className={'text-white!'} >
                                <AiOutlineEdit className="w-5 h-5"/>
                            </NavLink>
                        </div>
                        <div className="flex bg-red-800 w-10 h-10 rounded-full items-center justify-center hover:cursor-pointer  hover:bg-red-900 transition hover:scale-96">
                           <Popconfirm 
                           title="Are you sure?" 
                           description="Once deleted, it cannot be reverted back!" 
                           okText="Confirm"
                           onConfirm={() => {
                               deleteBanner(val)
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

    const deleteBanner = async(bannerId: string) => {
        setLoading(true)
        try {
            await bannerService.deleteBannerById(bannerId)
            await loadBannerData({page: 1, limit: 10}); 
            toast.success("Banner Deleted !!!", {description: "Banner has been deleted successfully!!!"})
        }catch {
            toast.error("Cannot delete!!", {description: "Banner cannot be deleted at this moment!!!"})
        }finally {
            setLoading(false);
        }
    }
    const loadBannerData = async ({ page = 1, limit = 2, search = null }: IPaginationParams) => {
        try {
            const response = await bannerService.getBannerList({
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
            toast.error("Cannot fetch", {
                description: "Banner cannot be loaded at this moment."
            })
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadBannerData({ page: 1, limit: 2, search: null })
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadBannerData({
            page: 1,
            limit: 2, 
            search: search
        });
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [search])

    return (
        <>
            <div className="flex flex-col w-full gap-5">
                <ListPageHeader
                    pageTitle="Banner Listing"
                    btnUrl="/admin/banner/create"
                    btnTxt={<><AiOutlinePlus /> <span>Add Banner</span></>}
                />
                <div className="flex flex-col gap-5">
                    <div className="w-full lg:w-1/3">
                        <Input.Search 
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        size="large" />
                    </div>
                    <div className="w-full">
                        <Table
                            columns={TableColumns}
                            dataSource={data}
                            pagination={{
                                ...pagination, 
                                onChange: async(page: number, pageSize: number) => {
                                   await loadBannerData({page, limit: pageSize}) 
                                }
                            }}

                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default BannerListPage; 