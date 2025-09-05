import MiniRouter from "./index";
import * as controller from "./controllers/apiController";

const app = new MiniRouter();

app.group("/api/users", (app) => {
  app.group("/:id", (app) => {
    app.get("/class", (req: any, res: any) => {
      res.end(JSON.stringify({ message: `User ${req.params.id} class retrieved` }));
    })
  })

  app.post("/", controller.postHandler);
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});