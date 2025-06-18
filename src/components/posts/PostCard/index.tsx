import LikeButtonInlineWrapper from "@/components/post/LikeButtonInlineWrapper";
import type { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

interface PostCardProps {
  post: Post;
  myId?: string;
}

const PostCard = ({ post, myId }: PostCardProps) => {
  return (
    <>
      <div className={styles.postCard}>
        <div className={styles.cardHeader}>
          {post.user && (
            <Link href={`/user/${post.user.id}`}>
              <Image
                src={post.user.iconUrl || "/file.svg"}
                alt="user icon"
                width={24}
                height={24}
                className={styles.userIcon}
              />
              {post.user.name}
            </Link>
          )}
        </div>
        <Link href={`/post/${post.id}`}>
          {post.images.length > 0 ? (
            <Image
              src={post.images[0].url}
              alt="thumb"
              width={80}
              height={80}
              className={styles.postCardImage}
            />
          ) : (
            <Image
              src="/no-image.svg"
              alt="no image"
              width={80}
              height={80}
              className={styles.postCardNoImage}
            ></Image>
          )}
        </Link>
        <div className={styles.postCardContent}>
          <div className={styles.postCardTitle}>
            <div className={styles.postCardName}>{post.title}</div>
            <div className={styles.postCardCategory}>
              {post.category === "SWEET" ? "スイーツ" : "ドリンク"}
            </div>
            <div className={styles.postCardLikeButton}>
              <LikeButtonInlineWrapper
                postId={post.id}
                initialLiked={
                  !!(myId && post.likes.some((like) => like.userId === myId))
                }
                initialLikeCount={post.likes.length}
              />
            </div>
          </div>
          <div className={styles.postCardShop}>
            店舗：{post.shop?.name || "未登録"}
          </div>
          <div className={styles.postCardScores}>
            <p>
              濃さ <span>{post.richness}</span>
            </p>
            <p>
              苦さ <span>{post.bitterness}</span>
            </p>
            <p>
              甘さ <span>{post.sweetness}</span>
            </p>
          </div>
          <div className={styles.postCardComment}>
            {post.comment || "コメントなし"}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
