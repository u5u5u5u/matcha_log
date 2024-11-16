import { Slider } from "@/components/ui/slider";
import { ControllerRenderProps } from "react-hook-form";

interface TasteProps {
  field: ControllerRenderProps;
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
