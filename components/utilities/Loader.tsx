import Image from "next/image";

const Loader = () => {
  return <div className="flex-center w-full">
    <Image src="/icons/loader.svg"  alt="" height={24} width={24} className="animate-spin"/>
  </div>; 
};

export default Loader;
