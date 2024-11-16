"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import DatePickerField from "./components/DatePickerField";
import GenreSelectField from "./components/GenreSelectField";
import InputField from "./components/InputField";
import PrefectureSelectField from "./components/PrefectureSelectField";
import TasteSlider from "./components/TasteSlider";

const formSchema = z.object({
  name: z.string(),
  genre: z.string(),
  price: z.number().positive(),
  date: z.date(),
  shop: z.string(),
  prefecture: z.string(),
  bitterness: z.number(),
  sweetness: z.number(),
  richness: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

const Registration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre: "",
      price: undefined,
      date: new Date(),
      shop: "",
      prefecture: "",
      bitterness: 5,
      sweetness: 5,
      richness: 5,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  const registrationValues: Array<{
    name: keyof FormValues;
    label: string;
    type?: string;
    placeholder?: string;
  }> = [
    { name: "name", label: "料理名", placeholder: "料理名を入力" },
    { name: "genre", label: "ジャンル" },
    { name: "price", label: "価格", type: "number", placeholder: "価格を入力" },
    { name: "date", label: "日付" },
    { name: "shop", label: "店舗", placeholder: "店舗名を入力" },
    { name: "prefecture", label: "都道府県" },
    { name: "bitterness", label: "苦さ" },
    { name: "sweetness", label: "甘さ" },
    { name: "richness", label: "濃さ" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {registrationValues.map((value) => (
          <FormField
            key={value.name}
            control={form.control}
            name={value.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{value.label}</FormLabel>
                <FormControl>
                  {value.name === "prefecture" ? (
                    <PrefectureSelectField
                      field={{
                        ...field,
                        name: field.name as "prefecture",
                        value: field.value as string,
                      }}
                    />
                  ) : value.name === "genre" ? (
                    <GenreSelectField
                      field={{
                        ...field,
                        name: "genre",
                        value: field.value as string,
                      }}
                    />
                  ) : value.name === "date" ? (
                    <DatePickerField
                      field={{
                        ...field,
                        name: field.name as "date",
                        value: field.value as Date,
                      }}
                    />
                  ) : value.name === "bitterness" ||
                    value.name === "sweetness" ||
                    value.name === "richness" ? (
                    <TasteSlider
                      field={{
                        ...field,
                        name: field.name as
                          | "bitterness"
                          | "sweetness"
                          | "richness",
                        value: Number(field.value),
                      }}
                    />
                  ) : (
                    <InputField
                      field={field}
                      type={value.type}
                      placeholder={value.placeholder}
                    />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
        ))}
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
