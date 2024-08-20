import { toast } from "lib/comps/ui/toast";

export const success = (arg: { body: any }) => {
  toast.success(
    <div
      className={cx(
        "c-cursor-pointer",
        css`
          font-family: ABeeZee;
        `
      )}
      onClick={() => {
        toast.dismiss();
      }}
    >
      {arg.body}
    </div>,
    {
      dismissible: true,
      className: css`
        background: #e4ffed;
        border: 2px solid green;

        .success-title {
          margin-bottom: 20px;
        }
      `,
    }
  );
};
