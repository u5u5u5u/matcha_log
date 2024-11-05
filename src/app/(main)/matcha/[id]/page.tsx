import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

const MatchaDetail = () => {
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

        <div className="flex flex-col w-full mt-1">
          <p className="text-right text-sm">2021年7月1日</p>
          <div className="w-full">
            <div>
              <h3 className="text-xl">抹茶かき氷</h3>
              <Badge>スイーツ</Badge>
            </div>
            <p>¥1,000</p>
            <div className="flex">
              <p>AZUMIYA</p>
              <p>東京都</p>
            </div>
          </div>
          <div className="w-2/3">
            <ul className="flex justify-between">
              <li className="text-center">
                <p>苦さ</p>
                <p>5</p>
              </li>
              <li className="text-center">
                <p>甘さ</p>
                <p>7</p>
              </li>
              <li className="text-center">
                <p>濃さ</p>
                <p>3</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchaDetail;
