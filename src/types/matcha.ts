export interface Matcha {
  id: number;
  name: string;
  imageUrl?: string;
  genre_id?: number;
  date?: Date;
  shop_id?: number;
  user_id: number;
  price: number;
}

export interface LatestMatcha {
  id: number;
  name: string;
  date: Date;
  shops: {
    prefecture_id: {
      name: string;
    };
  }
}