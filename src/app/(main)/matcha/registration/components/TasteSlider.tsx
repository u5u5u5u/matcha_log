import { Slider } from "@/components/ui/slider";
import { ControllerRenderProps } from "react-hook-form";

import { Matcha } from "@/types/matcha";
interface TasteProps {
  field: ControllerRenderProps<Matcha, "bitterness" | "sweetness" | "richness">;
}

const TasteSlider: React.FC<TasteProps> = ({ field }) => {
  return (
    <Slider
      value={[field.value || 0]}
      onValueChange={(value) => field.onChange(value[0])}
      max={10}
      step={1}
    />
  );
};

export default TasteSlider;
