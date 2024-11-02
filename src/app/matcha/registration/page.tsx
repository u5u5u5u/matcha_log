"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectScrollable } from "./components/SelectScrollable";

const formSchema = z.object({
  name: z.string(),
  genre: z.number(),
  price: z.number(),
  date: z.string(),
  shop: z.number(),
  prefecture: z.number(),
  bitterness: z.number(),
  sweetness: z.number(),
  richness: z.number(),
});

const Registration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre: 0,
      date: "",
      shop: 0,
      prefecture: 0,
      bitterness: 0,
      sweetness: 0,
      richness: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const formFields: Array<{
    name:
      | "name"
      | "genre"
      | "price"
      | "date"
      | "shop"
      | "prefecture"
      | "bitterness"
      | "sweetness"
      | "richness";
    label: string;
    type?: string;
    placeholder?: string;
  }> = [
    { name: "name", label: "料理名" }, // Input
    { name: "genre", label: "ジャンル" }, // Select
    { name: "price", label: "価格" }, // Input
    { name: "date", label: "日付" }, // Date Picker
    { name: "shop", label: "店舗" }, // Combobox
    { name: "prefecture", label: "都道府県" }, // Select
    { name: "bitterness", label: "苦さ" }, // Slider
    { name: "sweetness", label: "甘さ" }, // Slider
    { name: "richness", label: "濃さ" }, // Slider
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* {formFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: inputField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.name === "genre" || field.name === "prefecture" ? (
                    <Select {...inputField} /> // Render Select component for genre and prefecture
                  ) : field.name === "date" ? (
                    <DatePicker {...inputField} /> // Render DatePicker component for date
                  ) : field.name === "shop" ? (
                    <Combobox {...inputField} /> // Render Combobox component for shop
                  ) : field.name === "bitterness" ||
                    field.name === "sweetness" ||
                    field.name === "richness" ? (
                    <Slider {...inputField} min={0} max={10} /> // Render Slider component for taste attributes
                  ) : (
                    <Input
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      {...inputField}
                    /> // Default to Input component for text and number fields
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))} */}
        <SelectScrollable />
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
