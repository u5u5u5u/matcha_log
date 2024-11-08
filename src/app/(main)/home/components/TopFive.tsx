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

const TopFive = () => {
  return (
    <>
      <h2 className="text-lg ml-2">Top 5</h2>
      <Card className="flex flex-col items-center p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">名前</TableHead>
              <TableHead>都道府県</TableHead>
              <TableHead className="text-right">得点</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Link href="/ranking" className="text-xs">
          もっと見る
        </Link>
      </Card>
    </>
  );
}

export default TopFive;