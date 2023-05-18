import Image from "next/image";
import Link from "next/link";
import NavBar from "./navbar";
import { HeaderType } from "@/types/global-type";
import { socialLinks } from "@/constants/social";

const NavbarDesktop = ({ setIsShow }: HeaderType) => {
  return (
    <div className="fixed top-0 left-0 z-30 md:z-50 h-full w-full lg:w-[200px] bg-[#002464]">
      <div className="flex flex-1 flex-col bg-bg-100 text-white h-full rounded-[16px] overflow-y-auto scrollbar-hide">
        <div className="flex-1 px-2 pt-[72px] pb-5 lg:pt-[32px]">
          <Link href="/" className="hidden lg:block">
            <Image
              src="/images/logo.svg"
              className="mx-auto"
              width={140}
              height={36}
              alt="logo fx-box"
            />
          </Link>
          <div className="mt-5">
            <NavBar setIsShow={setIsShow} />
          </div>
        </div>
        <div className="flex h-[44px] gap-1 justify-between items-center border-t-[1px] border-t-white border-opacity-10 p-3">
          <div className="flex gap-2 items-center">
            <div className="text-white text-[14px] leading-[19px]">FXB</div>
            <div className="text-white text-[12px] leading-[19px] opacity-80">
              --
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Link href={socialLinks.TELEGRAM} target={"_blank"}>
              <Image
                src="/images/icons/telegram.svg"
                className="cursor-pointer"
                width={14}
                height={14}
                alt="telegram"
              />
            </Link>
            <Link href={socialLinks.TWITTER} target={"_blank"}>
              <Image
                src="/images/icons/twitter.svg"
                className="cursor-pointer"
                width={14}
                height={14}
                alt="twitter"
              />
            </Link>
            <Link href={socialLinks.DISCORD} target={"_blank"}>
              <Image
                src="/images/icons/discord.svg"
                className="cursor-pointer"
                width={14}
                height={14}
                alt="discord"
              />
            </Link>
            <Link href={socialLinks.YOUTUBE} target={"_blank"}>
              <Image
                src="/images/icons/youtube.svg"
                className="cursor-pointer"
                width={14}
                height={14}
                alt="youtube"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
