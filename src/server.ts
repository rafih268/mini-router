import MiniRouter from "./index";
import * as controller from "./controllers/authController";

const app = new MiniRouter();

app.post("/auth/sign-up", controller.signUpHandler);
app.post("/auth/sign-in", controller.signInHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});