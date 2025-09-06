import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { signUpSchema, signInSchema } from "../validators/authValidators";

export const signUpHandler = async (req: any, res: any) => {
  try {
    const data = signUpSchema.parse(req.body);

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, data.username));

    if (existingUser.length > 0) {
      res.statusCode(400);
      return res.end(JSON.stringify( { error: "Username already exists" }));
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [newUser]: any = await db
      .insert(usersTable)
      .values({
        name: data.name,
        username: data.username,
        password: hashedPassword
      }).returning();

    res.end(JSON.stringify({
      message: "User created",
      user: { id: newUser.id, username: newUser.username }
    }))
  } catch (err: any) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: err.errors || err.message }));
  }
}

export const signInHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "Sign in has been handled" }));
}