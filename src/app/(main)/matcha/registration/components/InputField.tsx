import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

import { Matcha } from "@/types/matcha";
interface InputProps {
  field: ControllerRenderProps<Matcha, keyof Matcha>;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({ field, type, placeholder }) => {
  return (
    <Input
      {...field}
      type={type}
      placeholder={placeholder}
      onChange={(e) =>
        field.onChange(type === "number" ? +e.target.value : e.target.value)
      } // typeがnumberの場合は数値に変換
      value={typeof field.value === "object" ? "" : field.value}
    />
  );
};

export default InputField;
