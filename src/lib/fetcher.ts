/**
 * 汎用的なfetcher関数
 * SWRやその他のデータフェッチングライブラリで使用可能
 */
export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `データの取得に失敗しました: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

/**
 * JSONデータをPOSTするfetcher関数
 */
export const postFetcher = async <T = unknown>(
  url: string,
  data: unknown
): Promise<T> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `データの送信に失敗しました: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * JSONデータをPUTするfetcher関数
 */
export const putFetcher = async <T = unknown>(
  url: string,
  data: unknown
): Promise<T> => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `データの更新に失敗しました: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * データをDELETEするfetcher関数
 */
export const deleteFetcher = async <T = unknown>(
  url: string
): Promise<T | null> => {
  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `データの削除に失敗しました: ${response.status} ${response.statusText}`
    );
  }

  // DELETEレスポンスが空の場合もあるため、レスポンスの内容をチェック
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
