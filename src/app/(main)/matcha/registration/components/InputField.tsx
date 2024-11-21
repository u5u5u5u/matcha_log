import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { FormValues } from "../page";

interface InputProps {
  form: UseFormReturn<FormValues>;
  name: "name" | "price";
  label: "料理名" | "価格";
  type?: string;
  placeholder?: string;
}

const InputField = ({ form, name, label, type, placeholder }: InputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              onChange={(e) =>
                field.onChange(
                  type === "number" ? +e.target.value : e.target.value
                )
              } // typeがnumberの場合は数値に変換
              value={typeof field.value === "object" ? "" : field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
