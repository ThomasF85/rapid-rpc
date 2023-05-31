function encodeArguments(args: any[]): string {
  if (args.length === 0) {
    return "none";
  }
  return encodeURIComponent(JSON.stringify(args));
}

export const fetcher = async (x: [path: string, args: any[]]): Promise<any> => {
  const [path, args] = x;
  const url =
    args.length === 0 ? path : `${path}?arguments=${encodeArguments(args)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const error: Error & { info?: any; status?: number } = new Error(
      "An error occurred while fetching the data."
    );

    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const postFunction = async (url: string, { arg }: { arg: any[] }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};
