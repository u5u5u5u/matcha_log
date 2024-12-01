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

export interface MatchaList {
  id: number;
  name: string;
  date: Date;
  shops: {
    prefectures: {
      name: string;
    };
  };
}

export interface MatchaDetail {
  matchas: {
    id: number;
    name: string;
    date: Date;
    genres: {
      name: string;
    };
    shops: {
      name: string;
      prefectures: {
        name: string;
      };
    };
    price: number;
    imageUrl?: string;
    created_at: Date;
  };
  bitterness: number;
  sweetness: number;
  richness: number;
}
