import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { ControllerRenderProps } from "react-hook-form";

interface TasteProps {
  label: string;
  field: ControllerRenderProps;
}

const TasteSlider: React.FC<TasteProps> = ({ label, field }) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Slider
          value={[field.value || 0]}
          onValueChange={(value) => field.onChange(value[0])}
          max={10}
          step={1}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default TasteSlider;
