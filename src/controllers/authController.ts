export const signUpHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "Sign up has been handled" }));
}

export const signInHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "Sign in has been handled" }));
}