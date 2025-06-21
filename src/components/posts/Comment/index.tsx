"use client";

import { useState } from "react";
import styles from "./index.module.scss";

interface CommentProps {
  comment: string;
}

const Comment = ({ comment }: CommentProps) => {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  const commentLimit = 50;
  const needsExpansion = comment && comment.length > commentLimit;

  const displayComment = () => {
    if (!comment) return "コメントなし";
    if (!needsExpansion || isCommentExpanded) return comment;
    return comment.substring(0, commentLimit) + "...";
  };
  return (
    <div className={styles.postCardComment}>
      {displayComment()}
      {needsExpansion && (
        <button
          className={styles.readMoreButton}
          onClick={() => setIsCommentExpanded(!isCommentExpanded)}
        >
          {isCommentExpanded ? "折りたたむ" : "続きを読む"}
        </button>
      )}
    </div>
  );
};

export default Comment;
