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

interface prefectureSelectProps {
  field: ControllerRenderProps;
}

import { dummyPrefecture } from "@/utils/dummy/prefecture";

const PrefectureSelectField: React.FC<prefectureSelectProps> = ({ field }) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="都道府県を選択してください" {...field} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {dummyPrefecture.map((prefecture) => (
            <SelectItem key={prefecture.id} value={prefecture.name}>
              {prefecture.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PrefectureSelectField;
