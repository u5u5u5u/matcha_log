"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { createClient } from "@/utils/supabase/client";
import DatePickerField from "./components/DatePickerField";
import GenreSelectField from "./components/GenreSelectField";
import InputField from "./components/InputField";
import ShopSelectField from "./components/ShopSelectField";
import TasteSliders from "./components/TasteSliders";
import ImageSelect from "./components/ImageSelect";

const formSchema = z.object({
  name: z.string(),
  imageUrl: z.string(),
  price: z.number().positive(),
  genre_id: z.string(),
  date: z.date(),
  shop_id: z.string(),
  bitterness: z.number(),
  sweetness: z.number(),
  richness: z.number(),
});

export type FormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      price: undefined,
      genre_id: "0",
      date: new Date(),
      shop_id: "0",
      bitterness: 5,
      sweetness: 5,
      richness: 5,
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("Form values", values);
    console.log((await supabase.auth.getUser()).data.user?.id);
    try {
      setUploading(true);

      const uid = (await supabase.auth.getUser()).data.user?.id;

      // ファイル入力フィールドからファイルを取得
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        throw new Error("画像ファイルを選択してください");
      }

      const file = fileInput.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Date.now()}.${fileExt}`;

      // Supabase ストレージにアップロード
      const { error: uploadError } = await supabase.storage
        .from("matchas")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      values.imageUrl = filePath;
      console.log(values);

      const { error: insertError } = await supabase.from("matchas").insert({
        name: values.name,
        genre_id: parseInt(values.genre_id, 10),
        date: values.date,
        shop_id: values.shop_id,
        user_id: uid,
        price: values.price,
        imageUrl: values.imageUrl,
      });

      if (insertError) {
        throw insertError;
      }

      alert("登録が完了しました！");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("登録中にエラーが発生しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          form={form}
          name="name"
          label="料理名"
          placeholder="料理名を入力"
        />
        <ImageSelect form={form} />
        <InputField
          form={form}
          name="price"
          label="価格"
          type="number"
          placeholder="価格を入力"
        />
        <GenreSelectField form={form} />
        <DatePickerField form={form} />
        <ShopSelectField form={form} />
        <TasteSliders form={form} />
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={uploading}
            className={`text-secondary-950 font-bold bg-primary-400 hover:bg-primary-500 mt-4 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "登録中..." : "登録"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Registration;
