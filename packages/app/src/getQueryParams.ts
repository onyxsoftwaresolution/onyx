export const getQueryParams = (object: Record<string, any>): string => {
  const searchParams = new URLSearchParams(object);
  return searchParams.toString();
}
