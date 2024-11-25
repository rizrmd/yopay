const w = window as any;
if (!w.esensi_cache) {
  w.esensi_cache = {};
}
const esensi_cache = w.esensi_cache as Record<string, any>;

export const cacheResult = <T>(arg: {
  name: string;
  load: () => Promise<T>;
  cached: (result: T) => void;
}) => {
  if (esensi_cache[arg.name]) {
    arg.cached(esensi_cache[arg.name]);
  } else {
    arg.load().then((result) => {
      esensi_cache[arg.name] = result;
      arg.cached(esensi_cache[arg.name]);
    });
  }
};
