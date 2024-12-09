import { overrideNav } from "lib/utils/override-nav";
import { useLocal } from "lib/utils/use-local";
import { useEffect } from "react";

export const MobileLayout = () => {
  const local = useLocal({ pathname: "..." });
  useEffect(() => {
    const pathname = location.href.split(`${location.host}${baseurl("")}`).pop() || ""
    if (local.pathname !== pathname) {
      local.pathname = pathname;
      local.render();

      
    }
  }, [location.href]);

  useEffect(() => {
    overrideNav();
  },[])

  return <></>;
};

