import { lazy, Suspense } from "react";
import { arrayMove } from "react-movable";
export const ReactMovable = lazy(async () => {
  return { default: (await import("react-movable")).List };
});

export const Movable = ({
  values,
  PassProp,
  children,
  onChange,
}: {
  values: any[];
  PassProp: any;
  children: any;
  onChange: (list: any[]) => void;
}) => {
  return (
    <>
      <Suspense>
        <ReactMovable
          values={values}
          onChange={({ oldIndex, newIndex }) =>
            onChange(arrayMove(values, oldIndex, newIndex))
          }
          lockVertically
          renderList={({ children, props }) => <ul {...props}>{children}</ul>}
          renderItem={({ props, value, index }) => {
            return (
              <li
                {...props}
                className={cx(
                  "c-list-none c-text-[14px]",
                  css`
                    font-family: ABeeZee;
                  `
                )}
              >
                <PassProp item={value} idx={index || 0} children={children} />
              </li>
            );
          }}
        />
      </Suspense>
    </>
  );
};
