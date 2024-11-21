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

interface NameInputFieldProps {
  form: UseFormReturn<FormValues>;
}

const NameInputField = ({ form }: NameInputFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>店名</FormLabel>
          <FormControl>
            <Input {...field} placeholder="店名を入力" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NameInputField;
