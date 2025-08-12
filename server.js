const MiniRouter = require("./index");
const apiController = require("./controllers/apiController");

const app = new MiniRouter();

app.get("/api", apiController.getHandler);

app.post("/api", apiController.postHandler);

app.put("/api", apiController.putHandler);

app.patch("/api", apiController.patchHandler);

app.delete("/api", apiController.deleteHandler);

app.listen(3000, () => {
  console.log("Server running on port 3000")
});