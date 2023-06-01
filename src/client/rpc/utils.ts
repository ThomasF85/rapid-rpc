export function encodeArguments(args: any[]): string {
  if (args.length === 0) {
    return "none";
  }
  return encodeURIComponent(JSON.stringify(args));
}
