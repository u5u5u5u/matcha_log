import Image from "next/image";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import type { FormValues } from "../page";

interface ImageSelectProps {
  form: UseFormReturn<FormValues>;
}

const ImageSelect = ({ form }: ImageSelectProps) => {
  const [imagePath, setImagePath] = useState<string>("/noimage.jpg");

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImagePath("/noimage.jpg");
      return;
    }
    const fileObject = e.target.files[0];
    console.log(fileObject);
    setImagePath(window.URL.createObjectURL(fileObject));
  };

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>画像</FormLabel>
          <FormControl>
            <div>
              <label
                className="button block text-sm text-[#71717A] bg-white rounded p-2 mb-2"
                htmlFor="image-upload"
              >
                画像を選択
              </label>
              <Input
                {...field}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  field.onChange(e);
                  onFileInputChange(e);
                }}
              />
              <Image src={imagePath} width={100} height={100} alt="preview" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageSelect;
