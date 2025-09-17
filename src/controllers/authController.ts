import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { signUpSchema, signInSchema } from "../validators/authValidators";

const JWT_SECRET = process.env.JWT_SECRET || "secretjsontoken";

export const signUpHandler = async (req: any, res: any) => {
  try {
    const data = signUpSchema.parse(req.body);

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, data.username));

    if (existingUser.length > 0) {
      res.statusCode = 400;
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
    }));
  } catch (err: any) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: err.message }));
  }
};

export const signInHandler = async (req: any, res: any) => {
  try {
    const data = signInSchema.parse(req.body);

    const [user]: any = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, data.username));

    if (!user) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid credentials" }));
    }

    const pwMatch = await bcrypt.compare(data.password, user.password);

    if (!pwMatch) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Invalid credentials" }));
    }

    await db
      .update(usersTable)
      .set({ status: "active" })
      .where(eq(usersTable.id, user.id));

    const token = jwt.sign({
      userId: user.id,
      username: user.username
    }, JWT_SECRET, { expiresIn: "1h" });

    res.end(JSON.stringify({ message: "Sign-in successful", token }));
  } catch (err: any) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: err.message }));
  }
};