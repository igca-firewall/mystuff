"use client";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { decryptKey, multiFormatDateString } from "@/lib/utils";

type PostCardProps = {
  post: any;
  className?: string;
};

const PostCard = ({ post, className = "" }: PostCardProps) => {
  const { user } = useUserContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const holdTimeout = useRef<NodeJS.Timeout | null>(null);
  const [localUserData, setLocalUserData] = useState<any>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("Trash");
    if (storedData) {
      const decryptedData = decryptKey(storedData);
      const parsedData = JSON.parse(decryptedData);
      setLocalUserData(parsedData);
    }
  }, []);

  if (!post.creator) return null;

  const toggleText = () => setIsExpanded(!isExpanded);

  const isLongCaption = post?.caption.length > 250;
  const truncatedCaption =
    post.caption.slice(0, 250) + (isLongCaption ? "..." : "");

  const handleLongPress = () => {
    navigator.clipboard.writeText(post.caption).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });
  };

  const handleTouchStart = () => {
    holdTimeout.current = setTimeout(handleLongPress, 800);
  };

  const handleTouchEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  return (
    <div
      className={`post-card bg-neutral-200 dark:bg-neutral-800 ${className} rounded-lg p-4 shadow-md`}
      onClick={toggleText}
      onContextMenu={handleLongPress} // For right-click on desktop
      onTouchStart={handleTouchStart} // For long press on mobile
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.creator.$id}`}>
            <div className="w-12 h-12 overflow-hidden rounded-full">
              <Image
                alt="Creator"
                className="w-12 h-12 rounded-full object-cover"
                src={post.creator.imageUrl || "/images/th.png"}
                width={48}
                height={48}
                quality={100}
                layout="responsive"
              />
            </div>
          </Link>
          <div className="flex flex-col">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">
              {post.creator.firstName} {post.creator.lastName}
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              <p>{multiFormatDateString(post.$createdAt)}</p>
              <span>•</span>
              <p>{post.location}</p>
            </div>
          </div>
        </div>

        {(user?.$id || localUserData?.$id) === post.creator.$id && (
          <Link href={`/update-post/${post.$id}`}>
            <div className="w-6 h-6 overflow-hidden">
              <Image
                width={20}
                height={20}
                alt="Edit"
                src="/icons/edit.svg"
                className="hover:opacity-75 transition-opacity duration-200"
                layout="responsive"
                quality={100}
              />
            </div>
          </Link>
        )}
      </div>

      {/* Caption section */}
      <div className="py-4">
        <div
          className={`text-sm lg:text-base text-neutral-800 dark:text-neutral-200 ${
            isExpanded ? "" : "line-clamp-2"
          }`}
        >
          {isExpanded || !isLongCaption ? (
            <div className="flex-col gap-6">
              <p>{post?.caption}</p>{" "}
              <p className="text-orange-500">{post.tags}</p>
            </div>
          ) : (
            truncatedCaption
          )}
          {isLongCaption && (
            <span className="text-orange-500 cursor-pointer ml-1">
              {isExpanded ? "Show less" : "Read more"}
            </span>
          )}
        </div>
      </div>

      {/* Image section */}
      <Link href={`/details/${post.$id}`}>
        {post.imageUrl && (
          <div className="w-90 h-100 overflow-hidden rounded-lg">
            <Image
              alt="Post image"
              className="rounded-lg object-cover w-full max-w-full max-h-[600px]"
              src={post.imageUrl}
              width={1}
              height={1}
              quality={100}
              layout="responsive"
              loading="lazy"
            />
          </div>
        )}
      </Link>

      {isCopied && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-700 text-dark-200 dark:text-white px-5 py-4 text-xs rounded-full shadow-md">
          Copied
        </div>
      )}
    </div>
  );
};

export default PostCard;
