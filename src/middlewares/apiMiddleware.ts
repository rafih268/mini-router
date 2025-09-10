export const mwOne = (req: any, res: any, next: () => void) => {
  req.middlewareOneExecuted = true;
  next();
}

export const mwTwo = (req: any, res: any, next: () => void) => {
  req.middlewareTwoExecuted = true;
  next();
}