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
import type { ShopList } from "@/types/shop";

const LatestShops = () => {
  const supabase = createClient();
  const [latestShop, setLatestShop] = useState<ShopList[]>([]);

  useEffect(() => {
    const getShopListTaste = async () => {
      const { data, error } = await supabase
        .from("matchas")
        .select(`id, date, shops (name)`)
        .order("date", { ascending: false })
        .limit(3)
        .returns<ShopList[]>();

      if (error) {
        console.error("Error: ", error);
      }

      if (data) {
        setLatestShop(data);
        console.log("shops:", data);
      }
    };

    getShopListTaste();
  }, []);

  return (
    <Card className="flex flex-col items-center py-2 px-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-left">名前</TableHead>
            <TableHead className="w-right">追加日</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestShop.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">{shop.shops.name}</TableCell>
              <TableCell>
                {shop.date
                  ? new Date(shop.date).toLocaleDateString()
                  : "日付不明"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link href="/shop" className="text-xs mt-4 mb-2">
        もっと見る
      </Link>
    </Card>
  );
};

export default LatestShops;
