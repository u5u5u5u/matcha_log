"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";

import InputField from "./components/InputField";
import GenreSelectField from "./components/GenreSelectField";
import DatePickerField from "./components/DatePickerField";

const formSchema = z.object({
  name: z.string(),
  genre: z.string(),
  price: z.number().positive(),
  date: z.date(),
  // shop: z.number(),
  // prefecture: z.number(),
  // bitterness: z.number(),
  // sweetness: z.number(),
  // richness: z.number(),
});

const Registration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre: "",
      price: 0,
      date: new Date(),
      // shop: 0,
      // prefecture: 0,
      // bitterness: 0,
      // sweetness: 0,
      // richness: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // const formFields: Array<{
  //   name:
  //     | "name"
  //     | "genre"
  //     | "price"
  //     | "date"
  //     | "shop"
  //     | "prefecture"
  //     | "bitterness"
  //     | "sweetness"
  //     | "richness";
  //   label: string;
  //   type?: string;
  //   placeholder?: string;
  // }> = [
  //   { name: "name", label: "料理名" }, // Input
  //   { name: "genre", label: "ジャンル" }, // Select
  //   { name: "price", label: "価格" }, // Input
  //   { name: "date", label: "日付" }, // Date Picker
  //   { name: "shop", label: "店舗" }, // Combobox
  //   { name: "prefecture", label: "都道府県" }, // Select
  //   { name: "bitterness", label: "苦さ" }, // Slider
  //   { name: "sweetness", label: "甘さ" }, // Slider
  //   { name: "richness", label: "濃さ" }, // Slider
  // ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <InputField
              label="料理名"
              field={field}
              placeholder="料理名を入力してください"
            />
          )}
        />
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => <GenreSelectField field={field} />}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <InputField
              label="価格"
              field={field}
              type="number"
              placeholder="価格を入力してください"
            />
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <DatePickerField field={field} />
          )}
        />
        <Button
          type="submit"
          className="text-secondary-950 font-bold bg-primary-400 hover:bg-primary-500"
        >
          登録
        </Button>
      </form>
    </Form>
  );
};

export default Registration;
