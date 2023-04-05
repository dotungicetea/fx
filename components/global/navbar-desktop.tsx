import Image from "next/image";
import Link from "next/link";
import NavBar from "./navbar";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setIsShow: Dispatch<SetStateAction<boolean>>;
}

const NavbarDesktop = ({ setIsShow }: Props) => {
  return (
    <div className="fixed top-0 left-0 z-30 h-full w-full lg:w-[250px] bg-[#002464]">
      <div className="bg-bg-100 text-white px-[28px] pt-[72px] pb-5 lg:py-[32px] h-full rounded-[16px] overflow-y-auto scrollbar-hide">
        <Link href="/" className="hidden lg:block">
          <Image
            src="/images/logo.svg"
            className="mx-auto"
            width={150}
            height={40}
            alt="logo fx-box"
          />
        </Link>
        <div className="mt-5">
          <NavBar setIsShow={setIsShow} />
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
