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

const Matcha = () => {
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
                <TableHead className="w-[150px]">抹茶</TableHead>
                <TableHead className="w-[100px]">都道府県</TableHead>
                <TableHead className="text-right">追加日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyMatcha.map((matcha) => (
                <TableRow key={matcha.id}>
                  <TableCell className="truncate">{matcha.name}</TableCell>
                  <TableCell>
                    {
                      dummyPrefecture.find(
                        (p) =>
                          p.id ===
                          dummyShop.find((s) => s.id === matcha.shop_id)
                            ?.prefecture_id
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
        </Card>
      </div>
    </div>
  );
};

export default Matcha;
