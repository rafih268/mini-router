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

      if (routeHandler) {
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
          routeHandler(req, res);
        });
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "Route not found" }));
      }
    });

    server.listen(port, callback);
  }
}

module.exports = MiniRouter;