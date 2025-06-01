// Post型定義
export type Post = {
  id: string;
  title: string;
  category: string;
  richness: number;
  bitterness: number;
  sweetness: number;
  comment?: string;
  shopId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  images: { url: string }[];
  shop?: {
    id: string;
    name?: string;
    address?: string;
    lat?: number;
    lng?: number;
  };
};
