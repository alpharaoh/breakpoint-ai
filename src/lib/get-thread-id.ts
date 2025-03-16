export const getThreadId = (pathname: string) => {
  if (pathname === "/") {
    return 1;
  }

  return parseInt(pathname.split("/")[1]);
};
