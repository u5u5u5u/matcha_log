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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { dummyMatcha } from "@/utils/dummy/matcha";
import { dummyPrefecture } from "@/utils/dummy/prefecture";
import { dummyShop } from "@/utils/dummy/shop";

const Ranking = () => {
  return (
    <Card className="h-[88vh] py-2 px-4 my-4">
      <div className="h-[90%]">
        <Table className="h-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[17%]">順位</TableHead>
              <TableHead className="w-[40%]">名前</TableHead>
              <TableHead className="w-[25%]">都道府県</TableHead>
              <TableHead className="w-[18%] text-right">得点</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {dummyMatcha.map((matcha, index) => (
              <TableRow key={matcha.id}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  <Link href={`/matcha/${matcha.id}`}>{matcha.name}</Link>
                </TableCell>

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
                <TableCell className="text-right">{matcha.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
};

export default Ranking;
