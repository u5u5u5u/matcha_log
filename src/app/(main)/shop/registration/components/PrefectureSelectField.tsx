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

import { Prefecture } from "@/types/prefecture";
import type { FormValues } from "../page";

import { createClient } from "@/utils/supabase/client";

interface PrefectureSelectProps {
  form: UseFormReturn<FormValues>;
}

const PrefectureSelectField = ({ form }: PrefectureSelectProps) => {
  const supabase = createClient();

  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);

  useEffect(() => {
    const getPrefectures = async () => {
      const { data, error } = await supabase
        .from("prefectures")
        .select("id, name")
        .returns<Prefecture[]>();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setPrefectures(data);
      }
    };

    getPrefectures();
  }, []);

  return (
    <FormField
      control={form.control}
      name="prefecture_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>都道府県</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value?.toString()}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder="都道府県を選択してください"
                  {...field}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {prefectures.map((prefecture) => (
                    <SelectItem
                      key={prefecture.id}
                      value={prefecture.id.toString()}
                    >
                      {prefecture.name}
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

export default PrefectureSelectField;
