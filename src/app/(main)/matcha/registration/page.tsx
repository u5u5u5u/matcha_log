"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";

import InputField from "./components/InputField";
import GenreSelectField from "./components/GenreSelectField";
import DatePickerField from "./components/DatePickerField";
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

const Registration = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      genre: "",
      price: 0,
      date: new Date(),
      shop: "",
      prefecture: "",
      bitterness: 5,
      sweetness: 5,
      richness: 5,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const formFields = [
    { name: "name", label: "料理名" },
    { name: "genre", label: "ジャンル" },
    { name: "price", label: "価格" },
    { name: "date", label: "日付" },
    { name: "shop", label: "店舗" },
    { name: "prefecture", label: "都道府県" },
    { name: "bitterness", label: "苦さ" },
    { name: "sweetness", label: "甘さ" },
    { name: "richness", label: "濃さ" },
  ];

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {formFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field }) => (
                <>
                  {field.name === "genre" ? (
                    <GenreSelectField field={field} />
                  ) : field.name === "date" ? (
                    <DatePickerField field={field} />
                  ) : field.name === "prefecture" ? (
                    <PrefectureSelectField field={field} />
                  ) : field.name === "bitterness" ||
                    field.name === "sweetness" ||
                    field.name === "richness" ? (
                    <TasteSlider
                      label={
                        formFields.find((f) => f.name === field.name)?.label ||
                        ""
                      }
                      field={field}
                    />
                  ) : (
                    <InputField
                      label={
                        formFields.find((f) => f.name === field.name)?.label ||
                        ""
                      }
                      field={field}
                      {...(field.name === "price" ? { type: "number" } : {})}
                      placeholder={`${
                        formFields.find((f) => f.name === field.name)?.label ||
                        ""
                      }を入力してください`}
                    />
                  )}
                </>
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
    </>
  );
};

export default Registration;
