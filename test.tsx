"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import DepartmentSelect from "@/components/company/DepartmentSelect";

const formSchema = z.object({
  name: z.string().min(1),
  department: z.string().min(1),
  enteringCompanyDate: z.string(),
  imageUrl: z.string().min(1),
  id: z.string().min(1),
  password: z.string().min(1),
  note: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const StaffRegistration = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department: "",
      enteringCompanyDate: "",
      imageUrl: "",
      id: "",
      password: "",
      note: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  const formFields: Array<{
    name: keyof FormValues;
    label: string;
    type?: string;
    placeholder?: string;
  }> = [
    {
      name: "name",
      label: "氏名",
      placeholder: "氏名を入力",
    },
    {
      name: "department",
      label: "部署",
      placeholder: "部署を選択",
    },
    {
      name: "enteringCompanyDate",
      label: "入社日",
      type: "date",
    },
    {
      name: "imageUrl",
      label: "画像",
      type: "file",
    },
    {
      name: "id",
      label: "ID",
      placeholder: "IDを入力",
    },
    {
      name: "password",
      label: "パスワード",
      placeholder: "パスワードを入力",
    },
    {
      name: "note",
      label: "備考",
      placeholder: "備考を入力",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: inputField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.name === "genre" ? (
                    <Textarea placeholder={field.placeholder} {...inputField} />
                  ) : field.name === "department" ? (
                    <Controller
                      name="department"
                      control={form.control}
                      render={({ field }) => <DepartmentSelect field={field} />}
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      type={field.type || "text"}
                      {...inputField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-center">
          <Button type="submit" className="bg-accent-500 hover:bg-accent-600">
            登録
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffRegistration;
