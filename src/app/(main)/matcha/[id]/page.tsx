import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MatchaDetail = () => {
  return (
    <>
      <div className="flex justify-around">
        <div className="w-[200px]">
          <AspectRatio ratio={1 / 1}>
            <Image
              src="/dummyMatcha.jpg"
              fill
              alt="抹茶かき氷"
              className="rounded-md object-cover"
            />
          </AspectRatio>
        </div>

        <div>
          <p>抹茶かき氷</p>
          <p>¥1,000</p>
          <p>AZUMIYA</p>
          <p>2021/07/01</p>
          <p>東京都</p>
        </div>
      </div>
      <div>
        <p>苦さ: 5</p>
        <p>甘さ: 7</p>
        <p>濃さ: 8</p>
      </div>
    </>
  );
};

export default MatchaDetail;
