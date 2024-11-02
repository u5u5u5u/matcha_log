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
  field: ControllerRenderProps<{ name: string }>;
  placeholder?: string;
}

const InputField: React.FC<InputProps> = ({ label, field, placeholder }) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input {...field} placeholder={placeholder} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default InputField;
