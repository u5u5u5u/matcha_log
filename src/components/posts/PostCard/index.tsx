import LikeButtonInlineWrapper from "@/components/post/LikeButtonInlineWrapper";
import CategoryTag from "@/components/posts/CategoryTag";
import Comment from "@/components/posts/Comment";
import ImageGallery from "@/components/posts/ImageGallery";
import MeetBallsMenu from "@/components/posts/MeetBallsMenu";
import type { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";

interface PostCardProps {
  post: Post;
  myId?: string;
  onUpdate?: () => void;
}

const PostCard = ({ post, myId, onUpdate }: PostCardProps) => {
  // デバッグ用：画像URLをログ出力
  console.log("PostCard images:", post.images);

  return (
    <>
      <div className={styles.postCard}>
        <div className={styles.cardHeader}>
          {post.user && (
            <>
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
              {post.user.id === myId && (
                <MeetBallsMenu postId={post.id} onUpdate={onUpdate} />
              )}
            </>
          )}
        </div>
        <div className={styles.imageWrapper}>
          <ImageGallery
            images={post.images}
            alt="post image"
            width={300}
            height={300}
            className={styles.postCardImage}
          />
        </div>
        <div className={styles.postCardContent}>
          <div className={styles.postCardTitle}>
            <div className={styles.postCardName}>{post.title}</div>
            <CategoryTag category={post.category} />
            <div className={styles.postCardLikeButton}>
              <LikeButtonInlineWrapper
                postId={post.id}
                initialLiked={
                  !!(myId && post.likes.some((like) => like.userId === myId))
                }
                initialLikeCount={post.likes.length}
                onUpdate={onUpdate}
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
          {post.comment && <Comment comment={post.comment} />}
        </div>
      </div>
    </>
  );
};

export default PostCard;
