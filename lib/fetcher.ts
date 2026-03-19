export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.message ?? "Something went wrong"
    );
  }

  return data as T;
}
