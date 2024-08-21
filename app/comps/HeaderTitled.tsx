import { parseLink } from "lib/comps/form/field/type/TypeLink";
import { fetchLinkParams, Spinner } from "lib/exports";
import { useLocal } from "lib/utils/use-local";
import { useEffect } from "react";

export const HeaderTitled = ({
  children,
  PassProp,
}: {
  children: any;
  PassProp: any;
}) => {
  const local = useLocal({ loaded: "", label: "", back_url: "" });

  useEffect(() => {
    local.loaded = location.hash;
    local.label = "";
    local.back_url = "";
    fetchLinkParams(parseLink()).then((links) => {
      if (links.length > 0) {
        const idx = links.length - 1;

        local.label = links[idx].prefix[0].label;
        local.back_url = links[idx].prefix[0].url;
      }
      local.render();
    });
  }, [location.hash]);

  if (location.hash.startsWith("#lnk=") && local.loaded !== location.hash) {
    if (!local.loaded) return <Spinner />;
  }

  return (
    <div
      className="c-flex c-items-center c-space-x-2"
      onClick={(e) => {
        e.preventDefault();
        if (local.back_url) {
          navigate(local.back_url);
        } else {
          navigate("/");
        }
      }}
    >
      <PassProp label={local.label}>{children}</PassProp>
    </div>
  );
};
