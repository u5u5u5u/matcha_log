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

const LatestMatcha = () => {
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
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">2024年11月8日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">2024年11月8日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">2024年11月8日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">2024年11月8日</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">2024年11月8日</TableCell>
            </TableRow>
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
