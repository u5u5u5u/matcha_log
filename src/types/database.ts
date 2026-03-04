// ========================================
// Supabase データベース型定義
// ========================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type CategoryEnum = "SWEET" | "DRINK";
export type TitleTypeEnum =
  | "POST_COUNT"
  | "TASTE_BITTER"
  | "TASTE_RICH"
  | "TASTE_SWEET"
  | "TASTE_BALANCE";
export type TitleRarityEnum = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

// ---- DB Row 型 (snake_case) ----

export type DbUser = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
  reset_token: string | null;
  reset_token_expiry: string | null;
  active_title_id: string | null;
};

export type DbPost = {
  id: string;
  title: string;
  category: CategoryEnum;
  comment: string | null;
  bitterness: number;
  richness: number;
  sweetness: number;
  user_id: string;
  shop_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DbImage = {
  id: string;
  url: string;
  post_id: string;
};

export type DbShop = {
  id: string;
  name: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
};

export type DbFollow = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

export type DbLike = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type DbTitle = {
  id: string;
  name: string;
  description: string | null;
  type: TitleTypeEnum;
  condition: Json;
  rarity: TitleRarityEnum;
  created_at: string;
};

export type DbUserTitle = {
  id: string;
  user_id: string;
  title_id: string;
  unlocked_at: string;
};

// ---- Supabase Database 型 ----

export type Database = {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<DbUser, "id">>;
      };
      posts: {
        Row: DbPost;
        Insert: Omit<DbPost, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<DbPost, "id">>;
      };
      images: {
        Row: DbImage;
        Insert: Omit<DbImage, "id"> & { id?: string };
        Update: Partial<Omit<DbImage, "id">>;
      };
      shops: {
        Row: DbShop;
        Insert: Omit<DbShop, "id"> & { id?: string };
        Update: Partial<Omit<DbShop, "id">>;
      };
      follows: {
        Row: DbFollow;
        Insert: Omit<DbFollow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbFollow, "id">>;
      };
      likes: {
        Row: DbLike;
        Insert: Omit<DbLike, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbLike, "id">>;
      };
      titles: {
        Row: DbTitle;
        Insert: Omit<DbTitle, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<DbTitle, "id">>;
      };
      user_titles: {
        Row: DbUserTitle;
        Insert: Omit<DbUserTitle, "id" | "unlocked_at"> & {
          id?: string;
          unlocked_at?: string;
        };
        Update: Partial<Omit<DbUserTitle, "id">>;
      };
    };
    Enums: {
      category_enum: CategoryEnum;
      title_type_enum: TitleTypeEnum;
      title_rarity_enum: TitleRarityEnum;
    };
  };
};
