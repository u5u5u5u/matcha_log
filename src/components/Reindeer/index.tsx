import "./index.css";
import { useState } from "react";

interface ReindeerProps {
  imgUrl: string;
  msgPos?: "left" | "right";
}

const Reindeer = ({ imgUrl, msgPos = "right" }: ReindeerProps) => {
  const [message, setMessage] = useState(
    "クリエイタソン おつかれさまでした！",
  ); // 初期メッセージ

  const messageBubbles = [
    "おつかれさまでした！",
    "クリエイタソン おつかれさまでした！",
  ];

  const handleClick = () => {
    const nextMessage =
      messageBubbles[Math.floor(Math.random() * messageBubbles.length)];
    setMessage(nextMessage);
  };

  return (
    <div
      className={`${
        msgPos === "left" ? "reindeer-image-left" : "reindeer-image-right"
      } reindeer-image`}
      onClick={handleClick}
    >
      <img src={imgUrl} alt="Reindeer" />
      <div
        className={`${
          msgPos === "left" ? "message-bubble-left" : "message-bubble-right"
        } message-bubble`}
      >
        {message}
      </div>
    </div>
  );
};

export default Reindeer;
