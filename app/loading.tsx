import Loader from "@/assets/loader.gif";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Image src={Loader} alt="Loading..." width={150} height={150} />
    </div>
  );
};

export default Loading;
