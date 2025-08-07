import { Input, Table } from "antd";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { useEffect, useState } from "react";
import type { IImageType, IPaginationParams } from "../../config/constants";
import { toast } from "sonner";
import userService from "../../services/user.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";

export interface IUserData {
    _id: string;
    name: string,
    email: string,
    role: string,
    gender: string,
    address: string,
    image: IImageType,
}

const UserPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 2,
    total: 0
  })
  const TableColumns = [
  {
    key: "name",
            title: "Name",
            dataIndex: "name"
  },
  {
    key: "email",
            title: "Email",
            dataIndex: "email"
  },
  {
    key: "role",
            title: "Role",
            dataIndex: "role"
  },
  {
    key: "gender",
            title: "Gender",
            dataIndex: "gender"
  },
  {
    key: "address",
            title: "Address",
            dataIndex: "address"
  },
  {
    key: "phone",
            title: "Phone",
            dataIndex: "phone"
  },
  {
    key: "image",
            title: "Image",
            dataIndex: "image",
            render: (val: string) => <img src={val} alt="User" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }} />
  },
  
];


const [data, setData] = useState<Array<IUserData>>([])
const [search, setSearch] = useState<string>('');
const loadUserData = async ({page=1, limit=5, search=null}: IPaginationParams) => {
  try {
    const response = await userService.getAllUSers({
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

  }catch {
    toast.error("Cannot fetch user data", {
      description: "User's data cannot be loaded as this moment. Please try later!"
    })
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadUserData({page:1, limit:5, search: null})
},[])

useEffect(() => {
  const timer = setTimeout(() => {
    loadUserData({
      page:1,
      limit:5,
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
          pageTitle="Users List"
        />
        <div className="flex flex-col w-full gap-5 lg:w-2/5">
                        <Input.Search 
                        onChange={(e) => {
                          setSearch(e.target.value)
                        }}
                        size="large"/>
        </div>
        <div className="w-full">
          <Table 
              columns={TableColumns}
              dataSource={data}
              pagination={{
                ...pagination,
                onChange: async(page: number, pageSize: number) => {
                                   await loadUserData({page, limit: pageSize}) 
                                }
              }}
              loading = {loading}
          />
        </div>

        </div>

    </>)
}

export default UserPage; 