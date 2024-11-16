import * as React from "react";

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

interface GenreSelectProps {
  field: ControllerRenderProps<Matcha, "genre_id">;
}

import { dummyGenre } from "@/utils/dummy/genre";

const GenreSelectField: React.FC<GenreSelectProps> = ({ field }) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="ジャンルを選択してください" {...field} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dummyGenre.map((genre) => (
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
