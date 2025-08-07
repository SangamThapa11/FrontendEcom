import type React from "react"
import { NavLink } from "react-router"

export interface IListPageHeaderProps {
    pageTitle?: string,
    btnUrl?: string,
    btnTxt? : React.ReactNode
}
const ListPageHeader = ({ pageTitle = '', btnUrl = '', btnTxt='' }: Readonly<IListPageHeaderProps>) => {
    return (
        <>
            <div className="flex items-center justify-between border-b border-b-gray-300/50 pb-3">
                <h1 className="text-4xl font-semibold text-teal-900">{pageTitle}</h1>
                {
                    btnUrl ? (
                        <NavLink to={btnUrl} className={'flex gap-1 justify-center items-center bg-teal-800! text-white p-2 w-40 rounded-md transition hover:cursor-pointer hover:scale-95 hover:bg-teal-900!'}>
                            {btnTxt}
                        </NavLink>
                    ) : (
                        <></>
                    )
                }
            </div>
        </>
    
    )
}

export default ListPageHeader; 