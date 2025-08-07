import type React from "react";

export const PageSection = () => {
    let description = `lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, saepe illo! Sint temporibus eius soluta sit, deleniti deserunt odit nihil cum beatae necessitatibus, suscipit quis distinctio consectetur tempore iste nam.`
    return(
        <p> {description}.</p>

    );
}
export interface IPageTitleProps {
    title: string, 
    className?: string,
    children?: React.ReactNode 
}
export const PageTitle= ({title, className='', children}: Readonly<IPageTitleProps>) => {
    return(
         <h1 className={`text-4xl font-semibold ${className} text-shadow-lg/35`}>
            {
            children ? children : title
            }
            </h1>
    );
}