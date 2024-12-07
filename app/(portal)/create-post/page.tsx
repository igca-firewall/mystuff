"use client"
import PostForm from "@/components/utilities/PostForm";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";

type postProp = {
  post: Models.Document; // If updating, provide the existing post object
};
const CreatePost = ({ post }: postProp) => {
  const action = post ? "Update" : "Create";
const router = useRouter();
const handleBack = () => {
  router.back();
};

  return (
    <div className="flex flex-1 h-screen">
      {/* Ensure full height */}
      <div className="common-container flex flex-col justify-center items-center h-full w-full">
        {/* Center content vertically and ensure full height and width */}
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-3 justify-center text-black">
          {/* Flex column on small screens, row on medium and larger */}
          <Image
            src={
              action === "Create"
                ? "/icons/add-post.svg"
                : "/icons/edit-post.svg"
            }
            width={36}
            height={36}
            alt={action === "Create" ? "add" : "edit"}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">
            {action === "Create" ? "Create Post" : "Update Post"}
          </h2>
        </div>
        <div className="w-full h-full mr-3 ml-3">
          <PostForm post={post} action={"Create"} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
