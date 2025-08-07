import { NavLink } from "react-router"

const NotFound = ({ redirect = '/' }: Readonly<{ redirect: string }>) => {
    return (<>
        <div className="flex flex-col justify-center w-full gap-10">
            <h1 className="text-4xl font-bold text-red-800 text-center">Oop!!! Not Found!!!</h1>
            <div className="text-center flex flex-col justify-center items-center gap-5">
                <div className="flex flex-col gap-1">
                    <p>Sorry, the page you’re looking for doesn’t exist.</p>
                    <p> It might have been moved, deleted, or never created.</p>
                    <p>Double-check the URL or try searching for something else.</p>
                    <p>If you think this is a mistake, please let us know.</p>
                    <p>Return to the  </p>
                </div>
                <NavLink to={redirect} className="bg-red-700 underline text-white p-2 w-1/3 justify-center rounded-md transition hover:scale-90">home! </NavLink>
            </div>
        </div>
    </>)
}

export default NotFound 