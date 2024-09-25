// components/CustomFormField.tsx

/* eslint-disable no-unused-vars */
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { Control, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import { registerLocale } from "react-datepicker";
import lt from "date-fns/locale/lt"; // Lithuanian locale

import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

registerLocale("lt", lt);

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
  filterDate?: (date: Date) => boolean;
  fieldType: FormFieldType;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex items-center rounded-md border border-gray-500 bg-white">
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
              placeholder={props.placeholder}
              {...field}
              className="border-0 flex-1"
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
            className="border border-gray-300"
            disabled={props.disabled}
          />
        </FormControl>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="LT"
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="text-gray-700">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <FormControl>
          <ReactDatePicker
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            showTimeSelect={props.showTimeSelect}
            timeIntervals={30}
            dateFormat={props.dateFormat || "MM/dd/yyyy"}
            placeholderText={props.placeholder}
            className="w-full border border-gray-300 p-2 rounded"
            filterDate={props.filterDate}
            minDate={new Date()}
            locale="lt"
          />
        </FormControl>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full border border-gray-300">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>{props.children}</SelectContent>
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
            <FormLabel className="text-gray-700">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
