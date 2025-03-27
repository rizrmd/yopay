export const readerSettings = {
  show: false,
  mode: (localStorage.getItem("reader-mode") || "swipe") as "scroll" | "swipe",
  page: {
    current: 1,
    id: "",
    load: (id: string) => {
      readerSettings.page.id = id;
      readerSettings.page.current = parseInt(
        localStorage.getItem(`${id}-page`) || "1"
      );
    },
    timeout: null as any,
    save: () => {
      clearTimeout(readerSettings.page.timeout);
      readerSettings.page.timeout = setTimeout(() => {
        localStorage.setItem(
          `${readerSettings.page.id}-page`,
          readerSettings.page.current.toString()
        );
      }, 1000);
    },
  },
  setMode(mode: "scroll" | "swipe") {
    readerSettings.mode = mode;
    localStorage.setItem("reader-mode", mode);
    readerSettings.render();
  },
  font: {
    current: parseInt(localStorage.getItem("reader-size") || "100"),
    decrease() {
      readerSettings.font.current -= 10;
      localStorage.setItem(
        "reader-size",
        readerSettings.font.current.toString()
      );
      readerSettings.render();
    },
    increase() {
      readerSettings.font.current += 10;
      localStorage.setItem(
        "reader-size",
        readerSettings.font.current.toString()
      );
      readerSettings.render();
    },
  },
  bg: {
    current: localStorage.getItem("reader-bg") || "white",
    set(bg: string) {
      readerSettings.bg.current = bg;
      localStorage.setItem("reader-bg", bg);
      readerSettings.render();
    },
    apply() {
      let bg = "white";
      let text = "black";
      if (readerSettings.bg.current === "black") {
        bg = "black";
        text = "white";
        (window as any).pdfPageColors = { background: bg, foreground: text };
      } else if (readerSettings.bg.current === "sepia") {
        bg = "#f3f3e5";
        text = "black";
        (window as any).pdfPageColors = { background: bg, foreground: text };
      } else {
        delete (window as any).pdfPageColors;
      }
      return { bg, text };
    },
  },
  render: () => {},
};

readerSettings.bg.apply();
