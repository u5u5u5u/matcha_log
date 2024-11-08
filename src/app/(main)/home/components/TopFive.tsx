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
            <TableRow>
              <TableCell className="font-medium text-center">1</TableCell>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-center">2</TableCell>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-center">3</TableCell>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-center">4</TableCell>
              <TableCell className="font-medium">抹茶かき氷</TableCell>
              <TableCell>熊本県</TableCell>
              <TableCell className="text-right">100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-center">5</TableCell>
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
    </div>
  );
}

export default TopFive;