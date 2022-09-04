import { compress } from "lzutf8";

export function compressor(json: string) {
  const res = compress(json, { outputEncoding: "BinaryString" });
  return res;
}
