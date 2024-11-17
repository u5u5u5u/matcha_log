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

import { dummyShop } from "@/utils/dummy/shop";

interface GenreSelectProps {
  field: ControllerRenderProps<Matcha, "shop_id">;
}

const GenreSelectField: React.FC<GenreSelectProps> = ({ field }) => {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value?.toString()}
    >
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="お店を選択してください" {...field} />
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
  );
};

export default GenreSelectField;
