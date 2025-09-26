import MiniRouter from "./index";
import * as controller from "./controllers/authController";
import * as middleware from "./middlewares/apiMiddleware"

const app = new MiniRouter();

app.post("/auth/sign-up", controller.signUpHandler);
app.post("/auth/sign-in", controller.signInHandler);
app.post("/auth/sign-out", middleware.verifyToken, controller.signOutHandler);
app.post("/auth/sign-out-all", middleware.verifyToken, controller.signOutFromAll);

app.get("/profile", middleware.verifyToken, (req: any, res: any) => {
  res.end(JSON.stringify({
    message: "User's profile",
    user: req.user
  }))
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});