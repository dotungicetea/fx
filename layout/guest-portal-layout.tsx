import Header from "@/components/global/Header";
import NavbarDesktop from "@/components/global/navbar-desktop";
import useMediaQuery from "@/components/hooks/media-query";
import { ReactElement, useState } from "react";

const GuestPortalLayout = (page: ReactElement) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isShow, setIsShow] = useState<boolean>(false);

  return (
    <>
      <div className="layout-bg">
        <Header setIsShow={setIsShow} />
        {(isDesktop || isShow) && <NavbarDesktop setIsShow={setIsShow} />}
        <div className="guest-portal-page">{page}</div>
      </div>
    </>
  );
};

export default GuestPortalLayout;
