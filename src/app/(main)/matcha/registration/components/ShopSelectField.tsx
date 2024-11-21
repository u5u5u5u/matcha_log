import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FormValues } from "../page";

import { dummyShop } from "@/utils/dummy/shop";

interface ShopSelectProps {
  form: UseFormReturn<FormValues>;
}

const ShopSelectField = ({ form }: ShopSelectProps) => {
  return (
      <FormField
        control={form.control}
        name="shop_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>お店</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue
                    placeholder="お店を選択してください"
                    {...field}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyShop.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id.toString()}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
  );
};

export default ShopSelectField;
