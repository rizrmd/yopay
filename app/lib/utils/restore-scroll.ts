const w = window as any;
if (!w.esensi_scroll) {
  w.esensi_scroll = {};
}
const scroll = w.esensi_scroll as Record<string, { x: number; y: number }>;

export const restoreScroll = (name: string) => {
  return {
    onScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      scroll[name] = {
        y: e.currentTarget.scrollTop,
        x: e.currentTarget.scrollLeft,
      };
    },
    ref: (div: HTMLDivElement | null) => {
      const scroll_pos = scroll[name];
      if (div && scroll_pos) {
        div.scrollTop = scroll_pos.y;
        div.scrollLeft = scroll_pos.x;
      }
    },
  };
};
