"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import NameInputField from "./components/NameInputField";
import PrefectureSelectField from "./components/PrefectureSelectField";

const formSchema = z.object({
  yolp_id: z.string(),
  name: z.string(),
  prefecture_id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type FormValues = z.infer<typeof formSchema>;

const ShopRegistration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yolp_id: "",
      name: "",
      prefecture_id: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log(values);
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
