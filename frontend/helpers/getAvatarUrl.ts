import md5 from "md5";

export function getAvatarUrl(email: string, size: number = 32): string {
  const hash = md5(email);

  return `https://www.gravatar.com/avatar/${hash}?d=mysteryman&s=${size * 2}`;
}
