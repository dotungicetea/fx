import { navbarItemsMain } from "@/constants/nav";
import { MainNavType } from "@/types/nav-type";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setIsShow: Dispatch<SetStateAction<boolean>>;
}

interface PropsNavItem {
  nav: MainNavType;
  setShowNav: Dispatch<SetStateAction<boolean>>;
}

const NavBarItem = ({ nav, setShowNav }: PropsNavItem) => {
  const router = useRouter();
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleShow = () => setIsShow(!isShow);
  const handleHideNav = () => setShowNav(false);

  const isMainNav = useMemo(() => {
    if (nav?.pathname === "/") return nav.pathname === router?.pathname;
    const regexPathname = new RegExp(nav?.pathname);
    return router?.pathname?.match(regexPathname);
  }, [nav?.pathname, router?.pathname]);

  return (
    <Link
      href={nav?.subItems ? {} : nav?.pathname}
      onClick={() => {
        nav?.subItems ? {} : handleHideNav && handleHideNav();
      }}
    >
      <div
        className={clsx(
          "cursor-pointer group px-[15px] py-[10px] mt-[6px] rounded-[8px]",
          "hover:bg-[#6681FF] hover:bg-opacity-60",
          isMainNav ? "bg-[#6681FF] bg-opacity-60" : ""
        )}
      >
        <div
          className="flex justify-between select-none"
          onClick={() => handleShow()}
        >
          <div className="flex items-center text-[14px] font-[600] leading-[28px] gap-[4px]">
            <Image src={nav.img} width={28} height={28} alt="icon nav" />
            <span
              className={clsx(
                "text-white group-hover:opacity-100",
                isMainNav ? "opacity-100" : "opacity-60"
              )}
            >
              {nav.content}
            </span>
          </div>
          {nav?.subItems && (
            <Image
              src="/images/icons/arrow_up.svg"
              className={clsx("duration-200", isShow ? "" : "rotate-180")}
              width={12}
              height={12}
              alt="arrow"
            />
          )}
        </div>
        {nav?.subItems &&
          isShow &&
          nav?.subItems.map((subItem, index) => {
            return (
              <Link
                key={index}
                href={subItem.pathname}
                onClick={() => handleHideNav()}
              >
                <div
                  className={clsx(
                    "pl-[32px] mt-1 font-[600] py-[12px] cursor-pointer text-[14px] select-none text-white",
                    "hover:bg-opacity-10 hover:bg-white hover:opacity-100 rounded-[8px]",
                    index === 0 ? "mt-2" : "",
                    subItem?.pathname === router?.pathname
                      ? "bg-opacity-10 bg-white opacity-100"
                      : "opacity-60"
                  )}
                >
                  {subItem?.content}
                </div>
              </Link>
            );
          })}
      </div>
    </Link>
  );
};

const NavBar = ({ setIsShow }: Props) => {
  return (
    <div>
      {navbarItemsMain?.map((navBarItem, index) => {
        return (
          <NavBarItem key={index} nav={navBarItem} setShowNav={setIsShow} />
        );
      })}
    </div>
  );
};

export default NavBar;
