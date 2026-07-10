// lib/http.ts
// This is a utility function that wraps the fetch API to make HTTP requests and handle errors.
// export async function http<T>(
//   url: string,
//   options?: RequestInit
// ): Promise<T> {
//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...options?.headers,
//     },
//   });

//   if (!res.ok) {
//     throw new Error(await res.text());
//   }

//   return res.json();
// }

export async function http<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    cache: "force-cache",

    next: {
      revalidate: 300,
    },

    ...options,
  });

  return res.json();
}