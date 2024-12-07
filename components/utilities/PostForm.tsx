"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
// import { FileUploader } from "@/components/utilities/FileUploader";
import { useParams, useRouter } from "next/navigation";
import { PostValidation } from "@/lib/utils";
import CustomFormField, { FormFieldType } from "../utilities/CustomInput";
import { useState, useEffect } from "react";
import {
  useCreatePost,
  // useUpdatePost,
} from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import Image from "next/image";
// import { ArrowLeftIcon } from "@heroicons/react/outline";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const router = useRouter();
  const { user } = useUserContext();
  const [imageUrl, setImageUrl] = useState<string | null>(
    post?.imageUrl || null
  );

  // Track form changes
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      tags: post?.tags || "",
      location: post?.location || "",
      file: undefined,
    },
  });

  const formValues = useWatch({ control: form.control });
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  // Compare form values with the original post data
  const hasChanges = () => {
    if (!post) return true;
    return (
      formValues.caption !== post.caption ||
      formValues.tags !== post.tags ||
      formValues.location !== post.location ||
      (formValues.file && formValues.file[0]?.name !== post.file?.[0]?.name)
    );
  };

  const handleClick = () => {
    setImageUrl(null); // Hide the image
    const fileInput = document.getElementById("fileUploader");
    if (fileInput instanceof HTMLInputElement) {
      fileInput.click(); // Trigger file input click
    }
  };

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();

  // const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
  //   useUpdatePost();

  useEffect(() => {
    if (post) {
      form.reset({
        caption: post.caption || "",
        tags: post.tags || "",
        location: post.location || "",
        file: undefined,
      });
      setImageUrl(post.imageUrl || null);
    }
  }, [post]);

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    setIsLoading(true);

    let formData: FormData | undefined;
    if (values.file && values.file.length > 0) {
      formData = new FormData();
      formData.append("blobFile", values.file[0]);
      formData.append("fileName", values.file[0].name);
      setIsFileUploading(true);
    }

    // try {
    //   if (post && action === "Update") {
    //     const updatedPost = await updatePost({
    //       postId: post.$id,
    //       file: formData,
    //       caption: values.caption,
    //       tags: values.tags,
    //       location: values.location,
    //     });

    //     if (!updatedPost) {
    //       setShowWelcomeMessage(true);
    //       setTimeout(() => {
    //         setShowWelcomeMessage(false);
    //       }, 3000);
    //     } else {
    //       router.push(`/pages/details/${post.$id}`);
    //       setShowMessage(true);
    //       setTimeout(() => {
    //         setShowMessage(false);
    //       }, 3000);
    //     }
    //   } else {
    //     const newPost = {
    //       creator: user.$id,
    //       caption: values.caption,
    //       tags: values.tags,
    //       location: values.location,
    //       file: formData,
    //     };

    //     const createdPost = await createPost(newPost);

    //     if (createdPost) {
    //       router.push("/");
    //     }
    //   }
    // } catch (error) {
    //   setShowWelcomeMessage(true);
    //   setTimeout(() => {
    //     setShowWelcomeMessage(false);
    //   }, 3000);
    // } finally {
    //   setIsLoading(false);
    //   setIsFileUploading(false);
    // }
  }
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex justify-center items-center py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full max-w-6xl p-6 bg-neutral-300 dark:bg-neutral-800 shadow-lg rounded-lg"
        ><div className="flex justify-normal gap-9 text-center items-center">
            <button
            className="p-1 right-2 rounded-full text-neutral-800 dark:text-neutral-100"
            onClick={handleBack}
          >
            {/* <ArrowLeftIcon className="w-6 h-6 dark:invert-white" /> */}
          </button>
          <h2 className="text-2xl font-semibold text-center text-neutral-800 dark:text-neutral-300 mb-4">
            {action} Post
          </h2>
        </div>
        

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="caption"
            label="Add a Post Caption"
            placeholder="Enter your caption"
            className="w-full resize-none overflow-hidden custom-scrollbar"
          />

          {imageUrl ? (
            <div
              className="relative w-full h-56 cursor-pointer"
              onClick={handleClick}
            >
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          ) : (
            // <Controller
            //   name="file"
            //   control={form.control}
            //   render={({ field }) => (
            //     <FormControl className="relative mt-4 h-56">
            //       <FileUploader
            //         files={field.value ? [field.value[0]] : []}
            //         onChange={(fileList) => {
            //           field.onChange(fileList);
            //           if (fileList.length > 0) {
            //             setImageUrl(URL.createObjectURL(fileList[0]));
            //           }
            //         }}
            //         className="mt-4"
            //       />
            //     </FormControl>
            //   )};
            // />
            "FileUploader"
          )}

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="location"
            label="Add a Location"
            placeholder="@london"
            className="w-full custom-scrollbar"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="tags"
            label="Add Tags"
            placeholder="Add relevant tags"
            className="w-full custom-scrollbar"
          />

          <Button
            disabled={isLoading || isFileUploading || !hasChanges()}
            type="submit"
            className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md 
              ${
                isLoading || isFileUploading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
          >
            {isLoading || isFileUploading ? (
              <div className="flex justify-center">
                {/* <SkeletonLoader className="w-8 h-8  rounded-full" /> */}
              </div>
            ) : (
              `${action} Post`
            )}
          </Button>
        </form>
      </Form>
      {showWelcomeMessage && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 dark:bg-neutral-700 bg-neutral-300 dark:text-white text-neutral-800 px-5 py-4 text-xs rounded-full shadow-md">
          Something went wrong, please try again later.
        </div>
      )}
      {showMessage && (
        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 dark:bg-green-800 bg-green-200 dark:text-white text-neutral-900 px-5 py-4 text-xs rounded-full shadow-md">
          {action === "Create"
            ? "Post created successfully"
            : "Post updated successfully"}
        </div>
      )}
    </div>
  );
};

export default PostForm;
