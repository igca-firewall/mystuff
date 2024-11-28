// components/PostSkeleton.tsx
import React from 'react';


const PostSkeleton: React.FC = () => {
  return (
    <div className="post-card bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 shadow-md">
      <div className="flex rounded-lg justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull " />
          <div className="flex flex-col">
            <div className="w-32 rounded-lg h-4 bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull  mb-2" />
            <div className="flex rounded-lg items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="w-20 rounded-lg h-4 bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull " />
              <span>•</span>
              <div className="w-20 rounded-lg h-4 bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull " />
            </div>
          </div>
        </div>
        <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-700 rounded-full dark:animate-brighten-dull-dark animate-brighten-dull " />
      </div>

      <div className="py-4">
        <div className="w-full h-4 rounded-lg bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull    mb-2" />
        <div className="w-full h-20 rounded-lg bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull " />
      </div>

      <div className="p-3">
        <div className="w-20 h-4 rounded-lg bg-neutral-300 dark:bg-neutral-700 dark:animate-brighten-dull-dark animate-brighten-dull " />
      </div>
    </div>
  );
};

export default PostSkeleton;
