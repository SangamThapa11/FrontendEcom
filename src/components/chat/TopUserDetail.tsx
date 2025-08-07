import { useSelector } from "react-redux"
import type { RootState } from "../../config/store.config"
import type { UserProfile } from "../../context/AuthContext"

const TopUserDetail = () => {
    const activeUser =useSelector((rootState: RootState) => {
        return rootState?.user?.activeUser as unknown as UserProfile
    })
    return (<>
    <div className="flex items-center gap-4 mb-6 border-b pb-4">
                           <div>
                              <img 
                              src={activeUser?.image}
                              alt={activeUser.name}
                              className="w-16 h-16 rounded-full border-2 border-teal-500 object-cover" />
                           </div>
                            <div>
                                <h2 className="text-xl font-semibold text-teal-900"> {activeUser?.name}</h2>
                                <p className="text-sm text-gray-500">{activeUser?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-teal-800 rounded">Online</span>
                            </div>
                        </div>
    </>)
}
export default TopUserDetail 