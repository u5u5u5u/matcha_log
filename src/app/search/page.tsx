import { PrismaClient } from "@/generated/prisma";
import Image from "next/image";
import React from "react";

const prisma = new PrismaClient();

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    cat?: "SWEET" | "DRINK";
    shop?: string;
    min?: string;
    max?: string;
  };
}) {
  const { q, cat, shop, min, max } = searchParams || {};
  const where: any = {};
  if (q) where.title = { contains: q };
  if (cat) where.category = cat;
  if (shop) where.shop = { name: { contains: shop } };
  if (min || max) {
    where.richness = {};
    if (min) where.richness.gte = Number(min);
    if (max) where.richness.lte = Number(max);
  }
  const posts = await prisma.post.findMany({
    where,
    include: { images: true, shop: true, user: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 24 }}>
        検索
      </h2>
      <form method="get" style={{ marginBottom: 24, display: "flex", gap: 8 }}>
        <input
          name="q"
          placeholder="キーワード"
          defaultValue={q}
          style={{ borderRadius: 8, border: "1px solid #d1d5db", padding: 8 }}
        />
        <select
          name="cat"
          defaultValue={cat || ""}
          style={{ borderRadius: 8, border: "1px solid #d1d5db", padding: 8 }}
        >
          <option value="">カテゴリ</option>
          <option value="SWEET">スイーツ</option>
          <option value="DRINK">ドリンク</option>
        </select>
        <input
          name="shop"
          placeholder="店舗名"
          defaultValue={shop}
          style={{ borderRadius: 8, border: "1px solid #d1d5db", padding: 8 }}
        />
        <input
          name="min"
          type="number"
          min={1}
          max={10}
          placeholder="濃さmin"
          defaultValue={min}
          style={{
            width: 70,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 8,
          }}
        />
        <input
          name="max"
          type="number"
          min={1}
          max={10}
          placeholder="濃さmax"
          defaultValue={max}
          style={{
            width: 70,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 8,
          }}
        />
        <button
          type="submit"
          style={{
            borderRadius: 8,
            background: "#1e8e3e",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            fontWeight: "bold",
          }}
        >
          検索
        </button>
      </form>
      <div>
        {posts.length === 0 ? (
          <div>該当する投稿がありません。</div>
        ) : (
          posts.map((post) => (
            <a
              key={post.id}
              href={`/post/${post.id}`}
              style={{
                display: "block",
                border: "1px solid #eee",
                borderRadius: 12,
                marginBottom: 16,
                padding: 16,
                textDecoration: "none",
                color: "#222",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {post.images.length > 0 ? (
                  <Image
                    src={post.images[0].url}
                    alt="thumb"
                    width={80}
                    height={80}
                    style={{
                      objectFit: "cover",
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      background: "#eee",
                      borderRadius: 8,
                      marginRight: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Image
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    {post.title}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#666" }}>
                    {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#888" }}>
                    店舗: {post.shop?.name || "未登録"}
                  </div>
                  <div style={{ fontSize: "0.95rem", color: "#888" }}>
                    濃さ: {post.richness} 苦さ: {post.bitterness} 甘さ:{" "}
                    {post.sweetness}
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
