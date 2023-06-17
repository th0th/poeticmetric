export default function getIsHosted(): boolean {
  return process.env.NEXT_PUBLIC_HOSTED === "true";
}
