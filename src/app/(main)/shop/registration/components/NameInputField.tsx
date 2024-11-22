import { useState } from "react";
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
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import type { FormValues } from "../page";
import { dummyShop } from "@/utils/dummy/shop";

interface NameInputFieldProps {
  form: UseFormReturn<FormValues>;
}

const NameInputField = ({ form }: NameInputFieldProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<string[] | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 入力に基づいて候補をフィルタリング
    if (value) {
      const matches = dummyShop
        .filter((shop) =>
          shop.name.toLowerCase().includes(value.toLowerCase())
        )
        .map((shop) => shop.name);
      setFilteredStores(matches);
    } else {
      setFilteredStores(null);
    }
  };

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>店名</FormLabel>
          <FormControl>
            <Select>
              <Input
                {...field}
                value={searchTerm}
                onChange={(e) => {
                  field.onChange(e); // フォームの値を更新
                  handleInputChange(e); // フィルタリング処理を実行
                }}
                placeholder="店名を入力"
              />
              <SelectTrigger></SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {filteredStores && filteredStores.map((store, index) => (
                    <SelectItem
                      key={index}
                      value={store}
                      onClick={() => {
                        setSearchTerm(store); // 選択された値を入力フィールドに反映
                        setFilteredStores([]); // 候補を非表示
                        field.onChange(store); // フォームの値を更新
                      }}
                      className={index === 0 ? "hidden" : ""}
                    >
                      {store}
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

export default NameInputField;
