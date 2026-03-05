export const dynamic = "force-dynamic";

import { supabase, mapToCamel } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./page.module.scss";

type Category = "SWEET" | "DRINK";

function normalizeTextParam(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeScore(value?: string) {
  if (!value) return undefined;

  const parsed = Number(value);
  if (Number.isNaN(parsed)) return undefined;

  return Math.max(1, Math.min(10, parsed));
}

function normalizeRange(min?: string, max?: string) {
  const normalizedMin = normalizeScore(min);
  const normalizedMax = normalizeScore(max);

  if (normalizedMin === undefined && normalizedMax === undefined) {
    return { min: undefined, max: undefined };
  }

  if (
    normalizedMin !== undefined &&
    normalizedMax !== undefined &&
    normalizedMin > normalizedMax
  ) {
    return { min: normalizedMax, max: normalizedMin };
  }

  return { min: normalizedMin, max: normalizedMax };
}

function createRangeLabel(label: string, min?: number, max?: number) {
  if (min !== undefined && max !== undefined) {
    return `${label}: ${min}〜${max}`;
  }

  if (min !== undefined) {
    return `${label}: ${min}以上`;
  }

  if (max !== undefined) {
    return `${label}: ${max}以下`;
  }

  return undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{
    q?: string;
    cat?: Category;
    shop?: string;
    min?: string;
    max?: string;
    rMin?: string;
    rMax?: string;
    bMin?: string;
    bMax?: string;
    sMin?: string;
    sMax?: string;
  }>;
}) {
  const { q, cat, shop, min, max, rMin, rMax, bMin, bMax, sMin, sMax } =
    (await searchParams) || {};

  const textQuery = normalizeTextParam(q);
  const shopQuery = normalizeTextParam(shop);
  const category = cat === "SWEET" || cat === "DRINK" ? cat : undefined;
  const richnessMinValue = rMin ?? min;
  const richnessMaxValue = rMax ?? max;
  const richnessRange = normalizeRange(richnessMinValue, richnessMaxValue);
  const bitternessRange = normalizeRange(bMin, bMax);
  const sweetnessRange = normalizeRange(sMin, sMax);

  let query = supabase
    .from("posts")
    .select("*, images(*), shop:shops(*), user:users(id,email,name,icon_url)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (textQuery) query = query.ilike("title", `%${textQuery}%`);
  if (category) query = query.eq("category", category);
  if (richnessRange.min !== undefined)
    query = query.gte("richness", richnessRange.min);
  if (richnessRange.max !== undefined)
    query = query.lte("richness", richnessRange.max);
  if (bitternessRange.min !== undefined)
    query = query.gte("bitterness", bitternessRange.min);
  if (bitternessRange.max !== undefined)
    query = query.lte("bitterness", bitternessRange.max);
  if (sweetnessRange.min !== undefined)
    query = query.gte("sweetness", sweetnessRange.min);
  if (sweetnessRange.max !== undefined)
    query = query.lte("sweetness", sweetnessRange.max);

  let shopIds: string[] | undefined;
  if (shopQuery) {
    const { data: rawShops } = await supabase
      .from("shops")
      .select("id")
      .ilike("name", `%${shopQuery}%`)
      .limit(100);

    shopIds = (rawShops ?? []).map((shopRow) => shopRow.id);
    if (shopIds.length > 0) {
      query = query.in("shop_id", shopIds);
    }
  }

  // すべての検索条件はサーバーサイドで適用する
  const rawPosts =
    shopIds !== undefined && shopIds.length === 0 ? [] : (await query).data;
  const posts = mapToCamel<
    {
      id: string;
      title: string;
      category: string;
      richness: number;
      bitterness: number;
      sweetness: number;
      images: { url: string }[];
      shop: { name: string } | null;
    }[]
  >(rawPosts ?? []);

  const activeFilterLabels = [
    category
      ? `カテゴリ: ${category === "SWEET" ? "スイーツ" : "ドリンク"}`
      : undefined,
    shopQuery ? `店舗: ${shopQuery}` : undefined,
    createRangeLabel("濃さ", richnessRange.min, richnessRange.max),
    createRangeLabel("苦さ", bitternessRange.min, bitternessRange.max),
    createRangeLabel("甘さ", sweetnessRange.min, sweetnessRange.max),
  ].filter((label): label is string => Boolean(label));

  const hasDetailFilter = activeFilterLabels.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.searchPanel}>
          <form method="get" className={styles.searchForm}>
            <div className={styles.mainSearchRow}>
              <input
                name="q"
                defaultValue={q}
                className={styles.mainInput}
              />
              <button type="submit" className={styles.searchButton}>
                検索する
              </button>
            </div>

            <details className={styles.detailAccordion} open={hasDetailFilter}>
              <summary className={styles.detailSummary}>
                詳細フィルター
                {hasDetailFilter && (
                  <span className={styles.summaryBadge}>
                    適用中 {activeFilterLabels.length}
                  </span>
                )}
              </summary>

              <div className={styles.detailBody}>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>カテゴリ</span>
                    <select name="cat" defaultValue={cat || ""}>
                      <option value="">すべて</option>
                      <option value="SWEET">スイーツ</option>
                      <option value="DRINK">ドリンク</option>
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>店舗名</span>
                    <input
                      name="shop"
                      placeholder="店舗名で絞り込み"
                      defaultValue={shop}
                    />
                  </label>

                  <div className={styles.rangeField}>
                    <span>濃さ（1〜10）</span>
                    <div className={styles.rangeInputs}>
                      <input
                        name="rMin"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={richnessMinValue}
                        placeholder="min"
                      />
                      <span>〜</span>
                      <input
                        name="rMax"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={richnessMaxValue}
                        placeholder="max"
                      />
                    </div>
                  </div>

                  <div className={styles.rangeField}>
                    <span>苦さ（1〜10）</span>
                    <div className={styles.rangeInputs}>
                      <input
                        name="bMin"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={bMin}
                        placeholder="min"
                      />
                      <span>〜</span>
                      <input
                        name="bMax"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={bMax}
                        placeholder="max"
                      />
                    </div>
                  </div>

                  <div className={styles.rangeField}>
                    <span>甘さ（1〜10）</span>
                    <div className={styles.rangeInputs}>
                      <input
                        name="sMin"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={sMin}
                        placeholder="min"
                      />
                      <span>〜</span>
                      <input
                        name="sMax"
                        type="number"
                        min={1}
                        max={10}
                        defaultValue={sMax}
                        placeholder="max"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.detailActions}>
                  <button type="submit" className={styles.searchButton}>
                    検索する
                  </button>
                  <Link href="/search" className={styles.resetLink}>
                    条件をクリア
                  </Link>
                </div>
              </div>
            </details>
          </form>
        </div>

        <div className={styles.resultHeader}>
          <p className={styles.resultCount}>検索結果 {posts.length} 件</p>

          {activeFilterLabels.length > 0 && (
            <ul className={styles.filterList}>
              {activeFilterLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.results}>
          {posts.length === 0 ? (
            <div className={styles.emptyState}>該当する投稿がありません。</div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className={styles.postCard}
                aria-label={post.title}
                title={post.title}
              >
                <div className={styles.postCardInner}>
                  {post.images.length > 0 ? (
                    <Image
                      src={post.images[0].url}
                      alt={post.title}
                      width={320}
                      height={320}
                      className={styles.postImage}
                    />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
