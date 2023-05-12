import crypto from "crypto";

export const sha256Hash = (text: string) => {
  return crypto.createHash("sha256").update(text).digest("base64");
};
