import { Input, Radio, Select, Upload, type UploadFile, Button, type UploadProps } from "antd"
import { Controller, useController } from "react-hook-form"
import { AiOutlineUpload } from "react-icons/ai"
import { InputType } from "../../config/constants";


export interface IInputBasicProps {
  name: string;
  //eslint-disable-next-line 
  control?: any;
  setValue?: (name: string, value: File) => void;
  errMsg?: string | null;
  type?: InputType;
}
export interface ISingleOption {
  label: string,
  value: string
}
export interface IFileUploadProps {
  name: string;
  control?: any;
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
  errMsg?: string | null;
}

export interface IMultipleOptionProps extends IInputBasicProps {
  options: Array<ISingleOption>
}

export const GeneralInput = ({ name, control, errMsg = null, type = InputType.TEXT }: Readonly<IInputBasicProps>) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (<>
            <Input
              id={name}
              type={type}
              {...field}
              size='large'
            />
            <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
          </>)
        }}
      />
    </>
  )
}

export const PasswordInput = ({ name, control, errMsg = null }: Readonly<IInputBasicProps>) => {
  const { field } = useController({
    name: name,
    control: control
  })
  return (<>
    <Input.Password id={name} {...field} size="large" autoComplete="new-password" />
    <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
  </>)
}

export const EmailInput = ({ name, control, errMsg = null }: Readonly<IInputBasicProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field }) => {
        return (
          <>
            <Input type="email" id={name} size="large" autoComplete="username" {...field} />
            <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
          </>
        )
      }}
    />
  )
}

export const TextInput = ({ name, control, errMsg = null }: Readonly<IInputBasicProps>) => {
  return (<>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (<>
          <Input
            id={name}
            type="text"
            {...field}
            size='large'
          />
          <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
        </>)
      }}
    />
  </>)
}

export const TextAreaInput = ({ name, control, errMsg = null }: Readonly<IInputBasicProps>) => {
  return (<>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (<>
          <Input.TextArea
            id={name}
            {...field}
            size='large'
            rows={1}
            style={{ resize: "none" }}
          />
          <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
        </>)
      }}
    />
  </>)
}

export const SelectOption = ({ name, control, options, errMsg = null }: Readonly<IMultipleOptionProps>) => {
  return (<>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (<>
          <Select className="w-full" size="large" options={options} {...field} />
          <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
        </>)
      }}
    />
  </>)
}

export const RadioOption = ({ name, control, options, errMsg = null }: Readonly<IMultipleOptionProps>) => {
  return (<>
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (<>
          <Radio.Group
            {...field}
            options={options}
          />
          <span className="text-red-700 text-sm italic font-light">{errMsg}</span>
        </>)
      }}
    />
  </>)
}

export const FileUpload = ({ 
  name, 
  control, 
  multiple = false, 
  accept, 
  maxCount,
  errMsg = null 
}: Readonly<IFileUploadProps>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => {
        const handleChange: UploadProps['onChange'] = ({ fileList }) => {
          // Convert FileList to array of files
          const files = fileList.map(file => file.originFileObj as File);
          onChange(multiple ? files : files[0]);
        };

        // Convert current value to UploadFile[] format with proper typing
        const fileList: UploadFile[] = (value ? (Array.isArray(value) ? value : [value]) : [])
          .filter((file): file is File => file instanceof File)
          .map((file: File, index: number) => ({
            uid: `${index}`,
            name: file.name,
            status: 'done' as const, // Use 'done' as const to match UploadFileStatus type
            originFileObj: file as any,
          }));

        return (
          <>
            <Upload
              {...field}
              fileList={fileList}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handleChange}
              multiple={multiple}
              accept={accept}
              maxCount={multiple ? maxCount : 1}
            >
              <Button icon={<AiOutlineUpload />}>
                Click to Upload
              </Button>
            </Upload>
            <span className="text-red-800 text-sm italic font-light">
              {errMsg}
            </span>
            {multiple && maxCount && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum {maxCount} files allowed
              </p>
            )}
          </>
        );
      }}
    />
  );
}