import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

interface InputProps {
  label: string;
  field: ControllerRenderProps;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({
  label,
  field,
  type,
  placeholder,
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          {...field}
          type={type}
          placeholder={placeholder}
          onChange={(e) =>
            field.onChange(type === "number" ? +e.target.value : e.target.value) // typeがnumberの場合は数値に変換
          }
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default InputField;
