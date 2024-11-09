import * as React from "react";

import {
  FormControl,
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
import { ControllerRenderProps } from "react-hook-form";

interface GenreSelectProps {
  field: ControllerRenderProps;
}

import { dummyGenre } from "@/utils/dummy/genre";

const GenreSelectField: React.FC<GenreSelectProps> = ({ field }) => {

  return (
    <FormItem>
      <FormLabel>ジャンル</FormLabel>
      <FormControl>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="ジャンルを選択してください" {...field} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {dummyGenre.map((genre) => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default GenreSelectField;
