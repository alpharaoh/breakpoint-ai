export const getThreadId = (pathname: string) => {
  return pathname.split("/")[1];
};
