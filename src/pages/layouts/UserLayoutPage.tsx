import { Dropdown, Menu, Space } from "antd";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router";
import logo from "../../assets/images/logo.jpg"
import { UserRoles } from "../../config/constants";
import { AdminMenu, SellerMenu } from "../../config/userMenuItems";
import type { ItemType } from "antd/es/menu/interface";
import { AiOutlinePoweroff, AiOutlineUser } from "react-icons/ai";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useUserLayout} from "../../context/UserLayoutContext"
import { FaBars } from "react-icons/fa";


const UserLayoutPage = ({ role }: Readonly<{ role: UserRoles }>) => {
    const navigate = useNavigate(); 
    const menu: ItemType[] = (role === UserRoles.ADMIN) ? AdminMenu : (role === UserRoles.SELLER ? SellerMenu : [])

    const { loggedInUser, setLoggedInUser } = useAuth();
    const { showSidebar, setLayoutContent } = useUserLayout();


    if (loggedInUser) {
    if(loggedInUser.role === role) {
        
        //console.log({showSidebar, contentFullWidth})
         return (<>
            <div className="flex w-full overflow-y-auto h-screen bg-gray-100">
                <div className={`${showSidebar ? 'w-1/5' : 'hidden'} bg-[#001529] h-full shadow-lg`}>
                    <div className="w-full mt-10 flex flex-col items-center justify-center mb-10 gap-8">
                        <img src={logo} className="w-30 rounded-full" alt="" />
                        <div className="flex flex-col gap-5 text-center">
                            <p className="text-lg font-semibold text-white">{loggedInUser.name}, 
                                <span className="text-xs italic font-light">{loggedInUser.role}</span>
                            </p>
                            <p className="text-sm font-light text-gray-100 italic">{loggedInUser.email}</p>
                        </div>
                    </div>
                    <Menu items={menu} theme="dark" />
                </div>
                <div className={`${showSidebar ? 'w-4/5' : 'w-full'} h-full flex flex-col gap-5`}>
                    <div className={`h-20 w-full bg-gray-200 flex items-center justify-between px-4 font-semibold `}>
                        
                            <>
                            <button className="hover:cursor-pointer bg-teal-50 p-2 rounded-md transition hover:scale-95" onClick={() => {
                                setLayoutContent({
                                    showSidebar: !showSidebar,
                                    contentFullWidth: showSidebar
                                })
                            }}>
                                <FaBars />
                            </button>
                            
                          </>
                        <Dropdown className="hover:cursor-pointer transition hover:scale-96" menu={{
                            items: [
                                {key: "profile", label: <NavLink to={'/admin/me'}>User Profile</NavLink>, icon: <AiOutlineUser/>},
                                {key: "logout", label:<span onClick={() =>{
                                    localStorage.clear()
                                    setLoggedInUser(null)
                                    navigate('/')
                                }}>Logout</span>, icon: <AiOutlinePoweroff/>}
                            ]
                        }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                   <AiOutlineUser />{""} {loggedInUser?.name}
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <div className="h-full mx-5 p-5 overflow-y-auto bg-gray-200 ">
                        <Outlet />
                    </div>
                    <div className="h-20 w-full bg-gray-200 ">Footer</div> 
                </div>
            </div>
        </>
        );
    } else {
        toast.warning("You don't have acess to this profile")
        return <Navigate to={'/' + loggedInUser.role} />
    }
    } else {
        toast.error("Please login first")
        return <Navigate to={"/"} />
    }
};
export default UserLayoutPage;