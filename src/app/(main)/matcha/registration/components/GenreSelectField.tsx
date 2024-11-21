import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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

import { Genre } from "@/types/genre";
import type { FormValues } from "@/app/(main)/matcha/registration/page";

interface GenreSelectProps {
  form: UseFormReturn<FormValues>;
}

import { createClient } from "@/utils/supabase/client";

const GenreSelectField = ({ form }: GenreSelectProps) => {
  const supabase = createClient();

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const getGenres = async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("id, name")
        .returns<Genre[]>();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setGenres(data);
      }
    };

    getGenres();
  }, []);

  return (
    <FormField
      control={form.control}
      name="genre_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>ジャンル</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value?.toString()}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue
                  placeholder="ジャンルを選択してください"
                  {...field}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
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

export default GenreSelectField;
