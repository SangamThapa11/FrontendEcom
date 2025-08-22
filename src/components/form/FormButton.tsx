
export interface FormButtonProps {
    children: React.ReactNode
    disabled?: boolean
    
}
export const CancelButton = ({children, disabled=false}: Readonly<FormButtonProps>) => {
    return (<>
    <button type="reset" disabled={disabled} className="disabled:bg-red-800/50 w-full disabled:cursor-not-allowed disabled:hover:bg-red-900/50 disabled:hover:scale-96 
    flex items-center justify-center gap-1 p-2 bg-red-800 text-white transition hover:bg-red-900 hover:scale-96 rounded-md">
        {children}
    </button>
    </>)
}

export const SubmitButton = ({children, disabled=false}: Readonly<FormButtonProps>) => {
    return (<>
    <button type="submit" disabled={disabled} className="disabled:bg-teal-800/50 w-full disabled:cursor-not-allowed disabled:hover:bg-teal-900/50 disabled:hover:scale-96 flex items-center justify-center gap-1 p-2 bg-teal-800 text-white transition hover:bg-teal-900 hover:scale-96 rounded-md">
        {children}
    </button>
    </>)
}