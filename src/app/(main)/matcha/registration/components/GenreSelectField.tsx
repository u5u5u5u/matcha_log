import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps } from "react-hook-form";

import { Matcha } from "@/types/matcha";
import { Genre } from "@/types/genre";

interface GenreSelectProps {
  field: ControllerRenderProps<Matcha, "genre_id">;
}

import { createClient } from "@/utils/supabase/client";

const GenreSelectField: React.FC<GenreSelectProps> = ({ field }) => {
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
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value?.toString()}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="ジャンルを選択してください" {...field} />
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
  );
};

export default GenreSelectField;
