import StudentFrotCard from '@/components/utilities/StudentFrotCard'
import React from 'react'

const CheckResults = () => {
  return (
    <ul className="flex flex-col gap-9 items-center justify-center w-full">
     
     < StudentFrotCard name="John Doe" className="Grade 10" age={15} />

    
{/* (
      <div className="flex-col h-[500px] justify-center items-center gap-3 rounded-lg">
        <div className="flex flex-col gap-3 items-center ">
          <p className="font-serif font-bold text-neutral-700 dark:text-neutral-200 text-[80px] md:text-[90px] xl:text-[100px]">
            !
          </p>
          <p className="items-center justify-center text-center font-regular text-[12px] md:text-[16px] xl:text-[20px] text-neutral-500 dark:text-neutral-400">
            Error fetching posts!
          </p>
          <p className="items-center justify-center text-center font-regular text-[9px] md:text-[12px] xl:text-[15px] text-neutral-500">
            Please check your internet connection or reload
          </p>
          <button
            className="bg-neutral-200 transition-transform duration-500 dark:bg-neutral-800 border-neutral-500 border-2 text-xs rounded-lg hover:bg-neutral-400 hover:text-white dark:hover:text-black-2 dark:hover:bg-neutral-400 hover:scale-110 text-neutral-800 dark:text-neutral-200 font-bold xl:w-56 md:w-48 w-36 py-4 px-6 ml-2"
            onClick={() => location.reload()}
          >
            Reload
          </button>
        </div>
      </div>
    ) */}
  </ul>
  )
}

export default CheckResults