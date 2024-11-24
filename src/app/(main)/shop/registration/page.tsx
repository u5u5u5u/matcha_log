"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { createClient } from "@/utils/supabase/client";

import NameInputField from "./components/NameInputField";
import PrefectureSelectField from "./components/PrefectureSelectField";

const formSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  prefecture_id: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

const ShopRegistration = () => {
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      place_id: "",
      name: "",
      prefecture_id: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("shops").insert({
        name: values.name,
        place_id: values.place_id || null,
        prefecture_id: parseInt(values.prefecture_id, 10),
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) {
        throw error;
      }
      console.log("登録が完了しました");
      form.reset();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("登録に失敗しました。再度お試しください。");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameInputField form={form} />
        <PrefectureSelectField form={form} />
        <div className="flex justify-center">
          <Button
            type="submit"
            className="text-secondary-950 font-bold bg-primary-400 hover:bg-primary-500"
          >
            登録
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ShopRegistration;
