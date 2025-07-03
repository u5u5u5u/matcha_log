# HEIC 画像対応改善について

## 問題

2.1MB の HEIC 画像を選択すると「4MB 以上である」というエラーが表示される問題がありました。これは、HEIC 画像を PNG に変換した際にファイルサイズが大幅に増加するためでした。

## 解決策

以下の変更を行い、HEIC 画像を効率的に処理できるようにしました：

### 1. ファイルサイズチェックの改善

- **アップロード時**: 元の HEIC ファイルのサイズで判定
- **変換後のサイズではなく**、元のファイルサイズで 4MB 制限をチェック

### 2. ファイル保存戦略の変更

- **保存**: 元の HEIC ファイルをそのまま保存
- **プレビュー**: PNG に変換したバージョンを表示
- **サーバー保存**: HEIC ファイルの元サイズで保存（効率的）

### 3. 表示時の動的変換

- **HeicImage コンポーネント**: 表示時に HEIC ファイルを自動検出・変換
- **画像プロキシ API**: HEIC ファイル検出とメタデータ提供
- **既存画像**: ImageGallery での HEIC 対応

## 変更されたファイル

### コンポーネント

- `src/components/me/IconUploadImage/index.tsx` - プロフィール画像アップロード
- `src/components/post/edit/PostUploadImage.tsx` - 投稿画像アップロード
- `src/components/util/HeicImage.tsx` - 新規作成：HEIC 画像表示コンポーネント
- `src/components/user/UserProfileClient/index.tsx` - プロフィール表示
- `src/components/me/MePageClient/index.tsx` - マイページ表示
- `src/components/posts/ImageGallery/index.tsx` - 投稿画像ギャラリー

### API

- `src/app/api/blob/upload/route.ts` - アップロード API（HEIC メタデータ対応）
- `src/app/api/image-proxy/route.ts` - 画像プロキシ API（HEIC 検出機能追加）

## 技術的な改善点

### ファイル処理の最適化

```typescript
// Before: 常にHEICをPNGに変換して保存
const convertedFile = await convertHeicToPng(heicFile);
await uploadFile(convertedFile); // 大きなPNGファイルをアップロード

// After: 元のHEICファイルを保存、プレビューのみ変換
await uploadFile(heicFile); // 小さなHEICファイルをアップロード
const previewUrl = await convertHeicForPreview(heicFile); // プレビューのみ変換
```

### 表示時の動的変換

```typescript
// HeicImageコンポーネントが自動的に処理
<HeicImage src="/heic-file.heic" /> // HEICファイルを自動検出・変換
```

## 利点

1. **ストレージ効率**: HEIC ファイルは通常 JPEG よりも 50%小さい
2. **アップロード速度**: 小さなファイルサイズでより高速
3. **ファイルサイズ制限**: 実際のアップロードサイズで判定
4. **互換性**: 表示時に自動変換でブラウザ互換性を確保
5. **ユーザビリティ**: 大きな HEIC 画像も問題なくアップロード可能

## 使用方法

ユーザーは従来通り HEIC 画像を選択するだけで、システムが自動的に最適な処理を行います：

1. **アップロード**: 元の HEIC ファイルが保存される
2. **プレビュー**: 自動的に PNG に変換されて表示
3. **投稿表示**: HeicImage コンポーネントが動的に変換

## 注意事項

- HEIC 変換は`heic-to`ライブラリに依存
- ブラウザでの変換処理のため、初回表示時に若干の遅延が発生する可能性
- サーバーサイドでの HEIC 変換には追加のライブラリが必要（現在はクライアントサイドで処理）
