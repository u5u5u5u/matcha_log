"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import DatePickerField from "./components/DatePickerField";
import GenreSelectField from "./components/GenreSelectField";
import InputField from "./components/InputField";
import ShopSelectField from "./components/ShopSelectField";
import TasteSliders from "./components/TasteSliders";

const formSchema = z.object({
  name: z.string(),
  genre_id: z.string(),
  price: z.number().positive(),
  date: z.date(),
  shop_id: z.string(),
  bitterness: z.number(),
  sweetness: z.number(),
  richness: z.number(),
});

export type FormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre_id: "0",
      price: undefined,
      date: new Date(),
      shop_id: "0",
      bitterness: 5,
      sweetness: 5,
      richness: 5,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
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
            className="text-secondary-950 font-bold bg-primary-400 hover:bg-primary-500 mt-4"
          >
            登録
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Registration;
