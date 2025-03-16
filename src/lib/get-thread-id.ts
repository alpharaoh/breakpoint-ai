export const getThreadId = (pathname: string) => {
  if (pathname === "/") {
    return 1;
  }

  return pathname.split("/")[1];
};
