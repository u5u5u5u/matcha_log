-- ========================================
-- Supabase マイグレーション SQL
-- Prisma スキーマからの移行
-- ========================================

-- UUID 拡張を有効化（Supabase ではデフォルトで有効）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Enum 型の定義
-- ========================================

CREATE TYPE category_enum AS ENUM ('SWEET', 'DRINK');

CREATE TYPE title_type_enum AS ENUM (
  'POST_COUNT',
  'TASTE_BITTER',
  'TASTE_RICH',
  'TASTE_SWEET',
  'TASTE_BALANCE'
);

CREATE TYPE title_rarity_enum AS ENUM (
  'COMMON',
  'RARE',
  'EPIC',
  'LEGENDARY'
);

-- ========================================
-- テーブル定義
-- ========================================

-- shops (posts が参照するため先に作成)
CREATE TABLE shops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT,
  lat         FLOAT,
  lng         FLOAT
);

-- titles (users が参照するため先に作成)
CREATE TABLE titles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  type        title_type_enum NOT NULL,
  condition   JSONB NOT NULL,
  rarity      title_rarity_enum NOT NULL DEFAULT 'COMMON',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- users
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT UNIQUE NOT NULL,
  name                TEXT,
  icon_url            TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reset_token         TEXT,
  reset_token_expiry  TIMESTAMPTZ,
  active_title_id     UUID REFERENCES titles(id) ON DELETE SET NULL
);

-- posts
CREATE TABLE posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    category_enum NOT NULL,
  comment     TEXT,
  bitterness  INT NOT NULL,
  richness    INT NOT NULL,
  sweetness   INT NOT NULL,
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_id     UUID REFERENCES shops(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- images
CREATE TABLE images (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url     TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

-- follows
CREATE TABLE follows (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- likes
CREATE TABLE likes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- user_titles
CREATE TABLE user_titles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title_id    UUID NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, title_id)
);

-- ========================================
-- updated_at 自動更新トリガー
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- インデックス (パフォーマンス向上)
-- ========================================

CREATE INDEX idx_posts_user_id     ON posts(user_id);
CREATE INDEX idx_posts_created_at  ON posts(created_at DESC);
CREATE INDEX idx_images_post_id    ON images(post_id);
CREATE INDEX idx_likes_post_id     ON likes(post_id);
CREATE INDEX idx_likes_user_id     ON likes(user_id);
CREATE INDEX idx_follows_follower  ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_user_titles_user  ON user_titles(user_id);
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- ========================================
-- Row Level Security (RLS) 設定
-- ※ server actions でサービスロールキーを使用するため全て無効
-- ========================================

ALTER TABLE users       DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts       DISABLE ROW LEVEL SECURITY;
ALTER TABLE images      DISABLE ROW LEVEL SECURITY;
ALTER TABLE shops       DISABLE ROW LEVEL SECURITY;
ALTER TABLE follows     DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes       DISABLE ROW LEVEL SECURITY;
ALTER TABLE titles      DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_titles DISABLE ROW LEVEL SECURITY;
