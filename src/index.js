import { validate$p } from "../dist/lib.js";

function validate(fp = "./") {
  return validate$p(fp)();
}

export {
  validate
}
