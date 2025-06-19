"use client";

import LikeButtonInlineWrapper from "@/components/post/LikeButtonInlineWrapper";
import MeetBallsMenu from "@/components/posts/MeetBallsMenu";
import ImageGallery from "@/components/posts/ImageGallery";
import type { Post } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import CategoryTag from "../CategoryTag";

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
              {post.user.id === myId && <MeetBallsMenu postId={post.id} />}
            </>
          )}
        </div>
        <ImageGallery
          images={post.images}
          alt="post image"
          width={80}
          height={80}
          className={styles.postCardImage}
        />
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
          {/* TODO: コメント長い場合隠す */}
          <div className={styles.postCardComment}>
            {post.comment || "コメントなし"}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
