import { ChevronDown, ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export const ReaderTop = ({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) => {
  return (
    <div
      className={cx(
        css`
          height: 40px;
        `,
        "c-border-b c-flex c-items-stretch w-full"
      )}
    >
      <div
        className={cx(
          "c-cursor-pointer c-border-r c-flex c-items-center c-justify-center",
          css`
            width: 40px;
          `
        )}
        onClick={() => {
          history.back();
        }}
      >
        <ChevronLeft size={20} />
      </div>
      <div
        className={"c-flex c-items-stretch c-text-xs c-px-2 c-justify-between c-flex-1"}
      >
        {left}
        <div className="c-flex c-items-center">{right}</div>
      </div>
    </div>
  );
};
