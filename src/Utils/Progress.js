// Progress output for CLI and JS API.
//
// A swappable handler slot determines what happens on each progress tick:
//   - Default: write to stdout with carriage-return overwrite (CLI, TTY only)
//   - setProgressHandler: replace with any (msg: string) => void function
//     (used by the JS API when the caller supplies an onProgress callback)
//   - resetProgressHandler: restore the default TTY behaviour

const ESC_CLEAR = "\r\x1b[K";

const defaultHandler = (msg) => {
  if (process.stdout.isTTY) {
    process.stdout.write(ESC_CLEAR + msg);
  }
};

let currentHandler = defaultHandler;

// Called from PureScript with a curried effectful fn: (String -> Effect Unit)
export const setProgressHandler = (fn) => () => {
  currentHandler = (msg) => fn(msg)();
};

export const resetProgressHandler = () => {
  currentHandler = defaultHandler;
};

export const progress = (msg) => () => {
  currentHandler(msg);
};

export const clearProgress = () => {
  // Only meaningful for the TTY default — custom handlers manage their own display.
  if (currentHandler === defaultHandler && process.stdout.isTTY) {
    process.stdout.write(ESC_CLEAR);
  }
};
