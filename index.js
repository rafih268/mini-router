const http = require("http");

class MiniRouter {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      PATCH: {},
      DELETE: {},
    };
  }

  get(path, handler) {
    this.routes.GET[path] = handler;
  }

  post(path, handler) {
    this.routes.POST[path] = handler;
  }

  put(path, handler) {
    this.routes.PUT[path] = handler;
  }

  patch(path, handler) {
    this.routes.PATCH[path] = handler;
  }

  delete(path, handler) {
    this.routes.DELETE[path] = handler;
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const method = req.method;
      const path = req.url;

      const routeHandler = this.routes[method][path];
      
      if (!routeHandler) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Route not found" }));
      }

      this.parseBody(req, () => {
        routeHandler(req, res);
      });
    });

    server.listen(port, callback);
  }

  parseBody(req, runHandler) {
    if (!["POST", "PUT", "PATCH"].includes(req.method)) {
      req.body = {};
      return runHandler();
    }

    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        req.body = {};
      }
      runHandler();
    });
  }
}

module.exports = MiniRouter;