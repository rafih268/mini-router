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

app.group("/api/users", (app) => {
  app.group("/:id", (app) => {
    app.get("/class", (req, res) => {
      res.end(JSON.stringify({ message: `User ${req.params.id} class retrieved` }));
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000")
});