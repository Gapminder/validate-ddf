// Progress output for CLI.
// Writes to stdout using carriage-return overwrite, only when stdout is a TTY.
// When piped/redirected the functions do nothing, keeping output clean.

const ESC_CLEAR = "\r\x1b[K";

export const progress = (msg) => () => {
  if (process.stdout.isTTY) {
    process.stdout.write(ESC_CLEAR + msg);
  }
};

export const clearProgress = () => {
  if (process.stdout.isTTY) {
    process.stdout.write(ESC_CLEAR);
  }
};
