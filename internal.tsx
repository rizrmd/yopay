export const Loading = () => {
  return (
    <>
      <img
        className={css`
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }

            50% {
              opacity: 0.5;
              transform: scale(1.1);
            }

            100% {
              opacity: 1;
            }
          }

          & {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            animation: pulse 1s infinite;
          }
        `}
        src="https://beta.esensi.online/_file/5b8a55fa-29b5-409d-b6b6-3dbf6d500126.webp"
      />
    </>
  );
};
