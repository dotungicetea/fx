import { CommingSoonType } from "@/types/global-type";
import Image from "next/image";

const CommingSoon = ({ title }: CommingSoonType) => {
  return (
    <div className="px-5 xl:px-10">
      <h1 className="text-[28px] text-center lg:text-left lg:text-[32px] font-semibold">
        {title}
      </h1>
      <div className="mt-[50px] text-center">
        <Image
          src="/images/global/comming-soon.png"
          className="w-full max-w-[334px] lg:max-w-full lg:w-[440px] h-[210px] lg:h-[280px] mx-auto"
          width={440}
          height={280}
          alt="icon comming soon"
        />
        <p className="text-[28px] lg:text-[32px] mt-10 font-semibold">
          Coming soon
        </p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
    </div>
  );
};

export default CommingSoon;
