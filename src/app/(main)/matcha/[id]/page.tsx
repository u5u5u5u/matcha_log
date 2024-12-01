"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

import type { MatchaDetail } from "@/types/matcha";
import { createClient } from "@/utils/supabase/client";

const MatchaDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<MatchaDetail | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const getMatcha = async () => {
      const { data, error } = await supabase
        .from("tastes")
        .select(
          `
            bitterness,
            sweetness,
            richness,
            matchas (
              id,
              name,
              date,
              price,
              imageUrl,
              created_at,
              genres (name),
              shops (
                name,
                prefectures (name)
              )
            )
          `
        )
        .eq("matcha_id", id)
        .returns<MatchaDetail>()
        .single();

      if (error) {
        console.error("Error: ", error);
      }
      if (data) {
        setData(data);
        console.log(data);
      }
    };

    getMatcha();
  }, [id]);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[428px]">
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/dummyMatcha.jpg"
              fill
              alt="抹茶かき氷"
              className="object-cover"
            />
          </AspectRatio>
        </div>

        <div className="flex flex-col w-full p-1">
          <p className="text-right text-sm">
            {data?.matchas.created_at
              ? new Date(data.matchas.created_at).toLocaleDateString()
              : "日付不明"}
          </p>
          <div className="w-full mt-2 mb-10 ml-2">
            <div className="flex">
              <h3 className="text-xl mr-6">{data?.matchas.name}</h3>
              <Badge variant="default">{data?.matchas.genres.name}</Badge>
            </div>
            <p>¥{data?.matchas.price}</p>
            <div className="flex">
              <p className="mr-4">{data?.matchas.shops.prefectures.name}</p>
              <p>{data?.matchas.shops.name}</p>
            </div>
          </div>
          <div className="w-2/3 m-auto">
            <ul className="flex justify-between">
              <li className="text-center">
                <p>苦さ</p>
                <p>{data?.bitterness}</p>
              </li>
              <li className="text-center">
                <p>甘さ</p>
                <p>{data?.sweetness}</p>
              </li>
              <li className="text-center">
                <p>濃さ</p>
                <p>{data?.richness}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchaDetail;
