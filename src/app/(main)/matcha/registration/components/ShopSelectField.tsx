import { useEffect, useState } from "react";
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

import { Shop } from "@/types/shop";
import type { FormValues } from "../page";

import { createClient } from "@/utils/supabase/client";

interface ShopSelectProps {
  form: UseFormReturn<FormValues>;
}

const ShopSelectField = ({ form }: ShopSelectProps) => {
  const supabase = createClient();
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    const getShops = async () => {
      const { data, error } = await supabase
        .from("shops")
        .select("id, name")
        .returns<Shop[]>();
      console.log(data);

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setShops(data);
      }
    };

    getShops();
  }, []);

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
                <SelectValue placeholder="お店を選択してください" {...field} />
              </SelectTrigger>
              {shops.length > 0 && (
                <SelectContent>
                  <SelectGroup>
                    {shops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id.toString()}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              )}
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ShopSelectField;
