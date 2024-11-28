
import Image from "next/image";


import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Control } from "react-hook-form";


export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  className?: string;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-full border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
            
              type={props.name === 'password' ? 'password' : 'text'}
              placeholder={props.placeholder}
              className="flex rounded-full border py-6"
              {...field}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

      // const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
      //   switch (props.fieldType) {
      //     // ... other cases
      
      // case FormFieldType.PHONE_INPUT:
      // return (
      //   <div className=" flex rounded-md border border-neutral-300 dark:border-neutral-800 ">
      //     <FormControl>
      //       <Input
      //       placeholder="+1 (123) 456-7890"
      //         // country="US"
      //         value={field.value as E164Number | undefined}
      //         onChange={(value) => field.onChange(value)}
      //         // inputClass="phone-input-input h-4 px-24 py-6 p-5" // Apply custom class for input
      //         // containerClass="phone-input-container" // Apply custom class for container
      //       />
      //     </FormControl>
      //   </div>
      // );
      // // ... other cases
      // //   }
      // // };
      
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    //  case FormFieldType.DATE_PICKER:
    //   return (
    //     <div className="flex rounded-md border border-dark-500 bg-dark-400">
    //       <Image
    //         src="/assets/icons/calendar.svg"
    //         height={24}
    //         width={24}
    //         alt="calendar"
    //         className="ml-2"
    //       />
    //       <FormControl>
    //         <ReactDatePicker
    //           showTimeSelect={props.showTimeSelect ?? false}
    //           selected={field.value}
    //           onChange={(date: Date | null) => field.onChange(date)}
    //           timeInputLabel="Time:"
    //           dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
    //           wrapperClassName="date-picker"
    //         />
    //       </FormControl>
    //     </div>
    //   );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props}  />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
