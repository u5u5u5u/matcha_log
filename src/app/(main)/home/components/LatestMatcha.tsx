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
    <>
      <h2 className="text-lg ml-2">最新の抹茶</h2>
      <Card className="flex flex-col items-center p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">抹茶</TableHead>
              <TableHead>都道府県</TableHead>
              <TableHead className="text-right">価格</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">¥500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">¥500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">¥500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">¥500</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">¥500</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Link href="/matcha" className="text-xs">
          もっと見る
        </Link>
      </Card>
    </>
  );
};

export default LatestMatcha;
