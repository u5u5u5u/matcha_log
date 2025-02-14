import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

import type { FormValues } from "../page";

interface TasteSlidersProps {
  form: UseFormReturn<FormValues>;
}

const Tastes: { name: "bitterness" | "sweetness" | "richness"; label: string }[] = [
  { name: "bitterness", label: "苦さ" },
  { name: "sweetness", label: "甘さ" },
  { name: "richness", label: "濃さ" },
];

const TasteSliders = ({ form }: TasteSlidersProps) => {
  return (
    <div>
      {Tastes.map((taste) => (
        <FormField
          key={taste.name}
          control={form.control}
          name={taste.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{taste.label}</FormLabel>
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
          )}
        />
      ))}
    </div>
  );
};

export default TasteSliders;
