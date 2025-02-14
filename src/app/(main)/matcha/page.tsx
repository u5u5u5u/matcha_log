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
  const [sortBy, setSortBy] = useState<"date" | "prefecture">("date");

  useEffect(() => {
    const getMatcha = async () => {
      let query = supabase
        .from("matchas")
        .select("id, name, date, shops (id, prefectures(id, name))");

      if (sortBy === "date") {
        query = query.order("date", { ascending: false });
      } else if (sortBy === "prefecture") {
        query = query.order("shops.prefectures.id", { ascending: false });
        console.log(query); 
      }

      const { data, error } = await query.returns<MatchaList[]>();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setData(data);
        console.log(data);
      }
    };

    getMatcha();
  }, [sortBy, supabase]);

  return (
    <Card className="flex flex-col items-center h-[90%] py-2 px-4 mt-4">
      <div className="flex justify-end w-full mb-4">
        <Button onClick={() => setSortBy("date")}>Sort by Date</Button>
        <Button onClick={() => setSortBy("prefecture")}>
          Sort by Prefecture
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">抹茶</TableHead>
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
  );
};

export default Matcha;
