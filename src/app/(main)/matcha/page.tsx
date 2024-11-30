"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";

import type { MatchaList } from "@/types/matcha";
import { createClient } from "@/utils/supabase/client";

const Matcha = () => {
  const supabase = createClient();
  const [data, setData] = useState<MatchaList[] | null>(null);

  useEffect(() => {
    const getMatcha = async () => {
      const { data, error } = await supabase
        .from("matchas")
        .select("id, name, date, shops (prefectures(name))")
        .order("date", { ascending: false })
        .returns<MatchaList[]>();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setData(data);
        console.log(data);
      }
    };

    getMatcha();
  }, []);

  return (
    <div>
      <ul>
        <li>
          <Link href="/matcha/1">Detail</Link>
        </li>
        <li>
          <Link href="/matcha/1/edit">Edit</Link>
        </li>
      </ul>
      <div>
        <Card className="flex flex-col items-center p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">抹茶</TableHead>
                <TableHead className="w-[100px]">都道府県</TableHead>
                <TableHead>追加日</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((matcha) => (
                <TableRow key={matcha.id}>
                  <TableCell>
                    <Link href={`/matcha/${matcha.id}`}>{matcha.name}</Link>
                  </TableCell>
                  <TableCell>{matcha.shops.prefectures.name}</TableCell>
                  <TableCell className="text-xs">
                    {matcha.date
                      ? new Date(matcha.date).toLocaleDateString()
                      : "日付不明"}
                  </TableCell>
                  <TableCell>
                    <Link href={`/matcha/${matcha.id}/edit`}>
                      <Button className="w-[40px] h-[40px] border p-1">
                        <Pencil size={20} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default Matcha;
