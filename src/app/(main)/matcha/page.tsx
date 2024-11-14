import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import { dummyMatcha } from "@/utils/dummy/matcha";

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
                <TableHead className="w-1/2">抹茶</TableHead>
                <TableHead className="">追加日</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyMatcha.map((matcha) => (
                <TableRow key={matcha.id}>
                  <TableCell>
                    <Link
                      href={`/matcha/${matcha.id}`}
                      className="flex items-center"
                    >
                      <Image
                        src={matcha.imageUrl}
                        alt={matcha.name}
                        width={30}
                        height={30}
                        className="rounded mr-4"
                      />
                      <p>{matcha.name}</p>
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">
                    {matcha.date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/matcha/${matcha.id}/edit`}>
                      <Button className="w-[40px] h-[40px] border p-1">
                        <Pencil size={20} />
                      </Button>
                    </Link>
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
