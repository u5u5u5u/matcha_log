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

const LatestMatcha = () => {
  const latestFiveMatcha = dummyMatcha.slice(0, 5);
  const prefecture = dummyPrefecture;
  const shop = dummyShop;

  return (
    <div>
      <h2 className="text-lg ml-2">最新の抹茶</h2>
      <Card className="flex flex-col items-center p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">抹茶</TableHead>
              <TableHead className="w-[100px]">都道府県</TableHead>
              <TableHead className="text-right">追加日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestFiveMatcha.map((matcha) => (
              <TableRow key={matcha.id}>
                <TableCell className="truncate">{matcha.name}</TableCell>
                <TableCell>
                  {
                    prefecture.find(
                      (p) =>
                        p.id ===
                        shop.find((s) => s.id === matcha.shop_id)?.prefecture_id
                    )?.name
                  }
                </TableCell>
                <TableCell className="text-right">
                  {matcha.date.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link href="/matcha" className="text-xs">
          もっと見る
        </Link>
      </Card>
    </div>
  );
};

export default LatestMatcha;
