export interface Matcha {
  id: number;
  name: string;
  imageUrl: string;
  genre_id: number;
  date: Date;
  shop_id: number;
  user_id: number;
  price: number;
}

export interface MatchaRegistrationValues {
  name: string;
  genre: string;
  price: number;
  date: Date;
  shop: string;
  prefecture: string;
  bitterness: number;
  sweetness: number;
  richness: number;
}
