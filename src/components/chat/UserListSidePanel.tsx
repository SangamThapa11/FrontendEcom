import { Avatar, List } from "antd";
import { type AppDispatch, type RootState } from "../../config/store.config";
import { useDispatch, useSelector } from "react-redux";
import type { UserProfile } from "../../context/AuthContext";
import { setActiveUser } from "../../reducer/User.reducer";

const UserListSidePanel = () => {
    const userList = useSelector((rootState: RootState) => {
        return {
            list: rootState?.user?.allUserList,
            pagination: rootState?.user?.userListPagination
        }
    })
  const dispatch = useDispatch<AppDispatch>() 
  
  const listItemClickHandle = (user: UserProfile) => {
    dispatch(setActiveUser(user))
  }
    return (<>
    <div className="w-1/5 flex flex-col bg-gray-50">
                <div className="h-20 w-full flex items-center justify-center border-b border-b-teal-950/30">
                    <h1 className="text-2xl font-semibold text-teal-900">Your Chat List</h1>
                </div>
                <div className="h-full overflow-y-scroll px-1">
                    {
                        userList && userList.list ? <>
                        <List
                        dataSource={userList?.list} 
                        renderItem={(user: UserProfile) => {

                            return (<>
                                <List.Item key={user._id} onClick={() => {
                                    listItemClickHandle(user); 
                                }}>
                                    <List.Item.Meta
                                        avatar={<Avatar className="w-15! h-15!" src={user.image} />}
                                        title={user.name}
                                        className="shadow-lg hover:bg-teal-100 transition hover:scale-97 p-2 bg-teal-50 rounded-md"
                                        description={
                                            <>
                                                <p className="truncate">{user.email},{""}</p> <span className="text-xs font-extralight italic">{user.role}</span>
                                            </>
                                        }
                                    />
                                    <div></div>

                                </List.Item>
                            </>
                            );
                        }}
                        className="overflow-y-scroll"
                    >
                    </List>
                        </>: <></>
                    }
                </div>
            </div>

    </>)
}
export default UserListSidePanel; 