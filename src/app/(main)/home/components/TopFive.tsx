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
import type { TopFiveTaste } from "@/types/taste";

const TopFive = () => {
  const supabase = createClient();
  const [topFiveTaste, setTopFiveTaste] = useState<TopFiveTaste[]>([]);

  useEffect(() => {
    const getTopFiveTaste = async () => {
      const { data, error } = await supabase
        .from("tastes")
        .select(
          `id, bitterness, sweetness, richness, matchas (name, shops (prefectures (name)))`
        )
        .returns<TopFiveTaste[]>();

      if (error) {
        console.error("Error: ", error);
      }

      if (data) {
        console.log("top5: ", data);
      }
      const scores = data?.map((taste) => {
        const score = taste.bitterness + taste.sweetness + taste.richness;
        return { ...taste, score };
      });

      const sortedTopFive = scores
        ?.sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (sortedTopFive) {
        setTopFiveTaste(sortedTopFive);
      }
    };

    getTopFiveTaste();
  }, []);

  return (
    <div>
      <h2 className="text-lg ml-2">Top 5</h2>
      <Card className="flex flex-col items-center p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">順位</TableHead>
              <TableHead className="w-[150px]">名前</TableHead>
              <TableHead className="w-[">都道府県</TableHead>
              <TableHead className="text-right">得点</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topFiveTaste.slice(0, 5).map((taste, index) => (
              <TableRow key={taste.id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {taste.matchas.name}
                </TableCell>
                <TableCell>{taste.matchas.shops.prefectures.name}</TableCell>
                <TableCell className="text-right">{taste.bitterness}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link href="/ranking" className="text-xs">
          もっと見る
        </Link>
      </Card>
    </div>
  );
};

export default TopFive;
