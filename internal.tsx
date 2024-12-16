export const Loading = () => {
  return (
    <>
      <img
        className={css`
          @keyframes pulse {
            0% {
              opacity: 1;
            }

            50% {
              opacity: 0.5;
            }

            100% {
              opacity: 1;
            }
          }

          & {
            width: 80px;
            height: 80px;
            border-radius: 6px;
            animation: pulse 1s infinite;
          }
        `}
        src="https://esensi.online/_file/5b8a55fa-29b5-409d-b6b6-3dbf6d500126.webp"
      />
    </>
  );
};
