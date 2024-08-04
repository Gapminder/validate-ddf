import stringify from "json-stable-stringify";

export function stableStringifyImpl (indent, obj) {
  return stringify(obj, {space: indent});
}