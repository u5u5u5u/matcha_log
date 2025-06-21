// Post型定義
export type Post = {
  id: string;
  title: string;
  category: "SWEET" | "DRINK";
  richness: number;
  bitterness: number;
  sweetness: number;
  comment: string | null;
  shopId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    url: string;
    postId: string;
  }[];
  likes: {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
  }[];
  user: {
    id: string;
    email: string;
    password: string;
    name: string | null;
    iconUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  shop: {
    id: string;
    name: string;
    address: string | null;
    lat: number | null;
    lng: number | null;
  } | null;
};
