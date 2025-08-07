const HorizontalDivider = ({dividerText='Or'}: Readonly<{dividerText: string}>) => {
    return(
        <span className="flex items-center">
             <span className="h-px flex-1 bg-gray-300"></span>

              {
                dividerText ? <span className="shrink-0 px-4 text-gray-900">{dividerText}</span> : <></>
              }

              <span className="h-px flex-1 bg-gray-300"></span>
            </span>
    )
}
export default HorizontalDivider; 
