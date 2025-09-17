import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secretjsontoken";

export const mwOne = (req: any, res: any, next: () => void) => {
  req.middlewareOneExecuted = true;
  next();
}

export const mwTwo = (req: any, res: any, next: () => void) => {
  req.middlewareTwoExecuted = true;
  next();
}

export const verifyToken = (req: any, res: any, next: () => void) => {
  const authHeader = (req.headers["authorization"] || "") as string;

  if (!authHeader.startsWith("Bearer ")) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ error: "No token provided" }));
  }

  const token: any = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err: any) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Invalid or expired token" }));
  }
}