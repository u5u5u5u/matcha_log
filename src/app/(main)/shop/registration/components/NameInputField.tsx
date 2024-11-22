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
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import type { FormValues } from "../page";

interface NameInputFieldProps {
  form: UseFormReturn<FormValues>;
}

// ダミーデータ
const dummyStores = [
  "スターバックス コーヒー 渋谷店",
  "タリーズ コーヒー 新宿店",
  "ドトール コーヒー 池袋店",
  "ブルーボトル コーヒー 六本木店",
  "エクセルシオール カフェ 銀座店",
];

const NameInputField = ({ form }: NameInputFieldProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 入力に基づいて候補をフィルタリング
    if (value) {
      const matches = dummyStores.filter((store) =>
        store.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStores(matches);
    } else {
      setFilteredStores([]);
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
                  {filteredStores.map((store, index) => (
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
