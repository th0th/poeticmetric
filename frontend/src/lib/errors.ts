export function NewError(cause: any): Error {
  return new Error("An error has occurred.", { cause });
}
