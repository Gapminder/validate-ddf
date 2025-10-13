import { validate$p } from "../dist/lib.js";

async function validate(
  fp = "./",
  { onlyErrors = false, generateDP = false } = {},
) {
  const result = await validate$p({ targetPath: fp, onlyErrors, generateDP })();
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
