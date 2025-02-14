"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createClient } from "@/utils/supabase/client";
import type { MatchaList } from "@/types/matcha";

const LatestMatcha = () => {
  const supabase = createClient();
  const [latestMatcha, setLatestMatcha] = useState<MatchaList[]>([]);

  useEffect(() => {
    const getLatestMatcha = async () => {
      const { data, error } = await supabase
        .from("matchas")
        .select(`id, name, date, shops (prefectures (name))`)
        .order("date", { ascending: false })
        .limit(3)
        .returns<MatchaList[]>();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setLatestMatcha(data);
        console.log(data);
      }
    };

    getLatestMatcha();
  }, []);

  return (
    <Card className="flex flex-col items-center py-2 px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">抹茶</TableHead>
            <TableHead className="w-[100px]">都道府県</TableHead>
            <TableHead className="text-right">追加日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestMatcha.map((matcha) => (
            <TableRow key={matcha.id}>
              <TableCell className="truncate">{matcha.name}</TableCell>
              <TableCell>{matcha.shops.prefectures.name}</TableCell>
              <TableCell className="text-right">
                {matcha.date
                  ? new Date(matcha.date).toLocaleDateString()
                  : "日付不明"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link href="/matcha" className="text-xs mt-4 mb-2">
        もっと見る
      </Link>
    </Card>
  );
};

export default LatestMatcha;
