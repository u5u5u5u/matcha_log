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
    let displayText = comment;
    if (needsExpansion && !isCommentExpanded) {
      displayText = comment.substring(0, commentLimit) + "...";
    }
    // 改行文字を<br>タグに変換
    return displayText.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < displayText.split("\n").length - 1 && <br />}
      </span>
    ));
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
