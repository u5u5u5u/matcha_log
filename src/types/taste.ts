export interface Taste {
  id: number;
  matcha_id: number;
  bitterness: number;
  sweetness: number;
  richness: number;
}

export interface TopFiveTaste {
  id: number;
  bitterness: number;
  sweetness: number;
  richness: number;
  matchas: {
    name: string;
    shops: {
      prefectures: {
        name: string;
      };
    };
  };
}
