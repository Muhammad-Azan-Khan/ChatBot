export const URL = import.meta.env.VITE_API_URL;

export function checkHeading(str) {
  return /^(\*)(\*)(.*)\*$/.test(str);
}

export function replaceHeadingStars(str) {
  return str.replace(/^(\*\*)/, "").replace(/(\*)$/, "");
}
