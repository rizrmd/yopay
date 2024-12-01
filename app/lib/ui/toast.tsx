import { toast } from "lib/comps/ui/toast";

export const success = (arg: { body: any }) => {
  toast.success(
    <div
      className={cx(
        "c-cursor-pointer",
        css`
          padding: 20px;
          font-family: ABeeZee;
        `
      )}
      onClick={toast.dismiss}
    >
      {arg.body}
    </div>,
    {
      dismissible: true,
      onClick: () => {
        toast.dismiss();
      },
      className: css`
        background: #e4ffed;
        border: 2px solid green;
        cursor: pointer;
        user-select: none;
        padding: 0px;

        .success-title {
          margin-bottom: 20px;
        }
      `,
    }
  );
};
