# まちゃろぐ (matcha_log)

抹茶スイーツ・抹茶ドリンクの体験を記録・共有する Web アプリです。  
投稿、いいね、フォロー、称号コレクションなどを Supabase を使って実装しています。

## 主な機能

- 抹茶投稿の作成・編集・削除（画像は最大 3 枚、評価値: 濃さ/苦さ/甘さ）
- 投稿一覧・投稿詳細表示、いいね機能
- ユーザープロフィール、フォロー/フォロー解除
- マイページ（自分の投稿・いいねした投稿の表示）
- 称号システム（投稿数・味覚ステータスに応じた解放/装備）
- 条件検索（キーワード、カテゴリ、店舗名、味評価レンジ）
- Supabase Auth ベースのログイン/サインアップ/パスワード再設定
- Supabase Storage への画像アップロード

## 技術スタック

- Next.js 15 (App Router)
- React 19 / TypeScript
- Supabase (Auth / PostgreSQL / Storage)
- SWR / Zod
- Sass Modules
- react-leaflet（店舗位置の地図表示）

## 主要ルート

| Route                                | 内容                   | 認証 |
| ------------------------------------ | ---------------------- | ---- |
| `/posts`                             | 投稿一覧               | 不要 |
| `/post/new`                          | 新規投稿               | 必須 |
| `/post/[id]`                         | 投稿詳細               | 不要 |
| `/post/[id]/edit`                    | 投稿編集（投稿者のみ） | 必須 |
| `/me`                                | マイページ             | 必須 |
| `/me/edit`                           | プロフィール編集       | 必須 |
| `/user/[id]`                         | 他ユーザープロフィール | 不要 |
| `/titles`                            | 称号コレクション       | 必須 |
| `/search`                            | 投稿検索               | 不要 |
| `/login` `/signup` `/reset-password` | 認証関連               | 不要 |

## セットアップ

### 1) 前提

- Node.js 20 以上を推奨
- pnpm 10 系
- Supabase プロジェクト

### 2) 依存関係インストール

```bash
pnpm install
```

### 3) Supabase 初期化

1. Supabase の SQL Editor で `supabase-migration.sql` を実行
2. Storage バケットを **public** で作成
   - `post-images`
   - `user-icons`

### 4) 環境変数 (`.env`)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional
SUPABASE_STORAGE_POST_IMAGES_BUCKET=post-images
SUPABASE_STORAGE_USER_ICONS_BUCKET=user-icons
```

| 変数名                                | 必須 | 用途                                               |
| ------------------------------------- | ---- | -------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | 必須 | Supabase URL（クライアント/サーバー双方で利用）    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | 必須 | Supabase セッション検証用（middleware/ブラウザ側） |
| `SUPABASE_SERVICE_ROLE_KEY`           | 必須 | Server Actions / 管理スクリプト実行用              |
| `NEXT_PUBLIC_SITE_URL`                | 推奨 | パスワード再設定メールのリダイレクト先生成         |
| `SUPABASE_STORAGE_POST_IMAGES_BUCKET` | 任意 | 投稿画像バケット名（既定: `post-images`）          |
| `SUPABASE_STORAGE_USER_ICONS_BUCKET`  | 任意 | ユーザーアイコンバケット名（既定: `user-icons`）   |

### 5) 初期データ投入（任意）

```bash
pnpm seed
pnpm sync-titles
```

### 6) 開発サーバー起動

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開いて確認できます。

## Scripts

```bash
pnpm dev            # 開発サーバー起動 (Turbopack)
pnpm build          # 本番ビルド
pnpm start          # 本番サーバー起動
pnpm lint           # ESLint
pnpm seed           # 称号データ投入
pnpm sync-titles    # 全ユーザーの称号再計算
pnpm migrate-storage # Vercel Blob -> Supabase Storage 移行（dry-run）
pnpm reset-password -- <email> <newPassword>
```

## Vercel Blob から Supabase Storage への移行

既存画像 URL が `blob.vercel-storage.com` の場合に利用できます。

```bash
# dry-run（件数確認）
pnpm migrate-storage

# 実行
pnpm migrate-storage -- --apply

# 先頭20件のみ
pnpm migrate-storage -- --limit=20

# users.icon_url のみ
pnpm migrate-storage -- --apply --users-only

# images.url のみ
pnpm migrate-storage -- --apply --images-only
```

## 直接実行する管理スクリプト

必要時のみ `tsx` で実行してください。

```bash
tsx scripts/reset-titles.ts      # 称号テーブル再作成
tsx scripts/delete-all-posts.ts  # 投稿・画像・いいね全削除（対話確認あり）
```

## デプロイ時メモ

- ホスティング先（例: Vercel）にも `.env` と同じ環境変数を設定
- `NEXT_PUBLIC_SUPABASE_URL` が未設定だと `next/image` の外部ホスト設定が不足し、画像表示に失敗する可能性があります
- `SUPABASE_SERVICE_ROLE_KEY` はサーバー専用で保持してください
