export interface Shop {
  id: number;
  name: string;
  place_id: string;
  prefecture_id: number;
  user_id: string;
}

export interface ShopList {
  id: number;
  name: string;
  date: Date;
  shops: {
    name: string;
    prefectures: {
      name: string;
    };
  };
}
