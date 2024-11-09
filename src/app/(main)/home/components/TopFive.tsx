import Link from "next/link";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { dummyMatcha } from "@/utils/dummy/matcha";
import { dummyPrefecture } from "@/utils/dummy/prefecture";
import { dummyShop } from "@/utils/dummy/shop";

const TopFive = () => {
  const topFiveMatcha = dummyMatcha.slice(0, 5);
  const prefecture = dummyPrefecture;
  const shop = dummyShop;

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
            {topFiveMatcha.map((matcha, index) => (
              <TableRow key={matcha.id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">{matcha.name}</TableCell>
                <TableCell>
                  {
                    prefecture.find(
                      (p) =>
                        p.id ===
                        shop.find((s) => s.id === matcha.shop_id)?.prefecture_id
                    )?.name
                  }
                </TableCell>
                <TableCell className="text-right">{matcha.price}</TableCell>
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
