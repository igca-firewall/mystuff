// "use client";

// import Image from "next/image";
// import React, { useCallback, useRef } from "react";
// import { useDropzone } from "react-dropzone";
// import { convertFileToUrl } from "@/lib/utils";

// type FileUploaderProps = {
//   files: File[] | undefined;
//   onChange: (files: File[]) => void;
//   className?: string
//   id?: string
// };

// export const FileUploader = ({ files, onChange, className, id }: FileUploaderProps) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     // Clear any previously selected files and add the new ones
//     onChange(acceptedFiles);
//   }, [onChange]);

//   const { getRootProps, getInputProps } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': [] // Allow only image files
//     }
//   });

//   const handleClick = () => {
//     inputRef.current?.click();
//   };

//   return (
//     <div
//       {...getRootProps()}
//       className="relative cursor-pointer"
//       onClick={handleClick}
//     >
//       <input
//         {...getInputProps()}
//         ref={inputRef}
//         style={{ display: 'none' }} // Hide the input element
//       />
//       {files && files.length > 0 ? (
//         <div className="relative w-full max-h-[900px] rounded-md overflow-hidden">
//           <Image
//             src={convertFileToUrl(files[0])}
//             width={1000}
//             height={1000}
//             alt="uploaded image"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-md">
//             <input
//               type="text"
//               placeholder="Add a caption..."
//               className="w-full py-1 px-2 bg-transparent text-white placeholder-white focus:outline-none"
//             />
//           </div>
//         </div>
//       ) : (
//         <>
//           <Image src="/icons/upload.svg" width={40} height={40} alt="upload" />
//           <div className="file-upload_label">
//             <p className="text-14-regular">
//               <span className="text-orange-500">Click to upload </span>
//               or drag and drop
//             </p>
//             <p className="text-12-regular">
//               SVG, PNG, JPG or GIF (max. 800x400px)
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

import React from 'react'

const FileUploader = () => {
  return (
    <div>FileUploader</div>
  )
}

export default FileUploader