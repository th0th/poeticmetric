export function base64Encode(s: string) {
  return btoa(encodeURIComponent(s).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode(Number(`0x${p1}`)),
  ));
}
