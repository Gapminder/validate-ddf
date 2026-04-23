import { validate$p, setProgressCallback, resetProgressCallback } from "../dist/lib.js";

async function validate(
  fp = "./",
  { onlyErrors = false, generateDP = false, onProgress = null } = {},
) {
  if (onProgress) {
    // Wrap the plain JS callback into the curried Effect form PureScript expects.
    setProgressCallback((msg) => () => onProgress(msg))();
  }

  let result;
  try {
    result = await validate$p({ targetPath: fp, onlyErrors, generateDP })();
  } finally {
    if (onProgress) {
      resetProgressCallback();
    }
  }

  const success = result[0];
  const messages = result[1];
  if (success) {
    return {
      success: "Validation successful.",
      errors: messages.length > 0 ? messages : null,
    };
  } else {
    return { success: null, errors: messages };
  }
}

export { validate };
