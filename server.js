const MiniRouter = require("./index");
const apiController = require("./controllers/apiController");
const middleware = require("./middlewares/apiMiddleware")

const app = new MiniRouter();

app.use((req, res, next) => {
  if (req.query.access_key) {
    req.query.access_key == 1
      ? next() : res.end(JSON.stringify({ error: "Access key does not match" }));
  } else {
    res.end(JSON.stringify({ error: "Access key not found" }));
  }
})

app.group("/api", function(app) {
  app.get("/users/:id", apiController.getUserHandler);
  app.post("/", middleware.mwOne, middleware.mwTwo, apiController.postHandler);
});

// Routes below tested within group function

// app.get("/api/users/:id", apiController.getUserHandler);

// app.post("/api", middleware.mwOne, middleware.mwTwo, apiController.postHandler);

app.put("/api", apiController.putHandler);

app.patch("/api", apiController.patchHandler);

app.delete("/api", apiController.deleteHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000")
});