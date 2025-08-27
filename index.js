const http = require("http");
const url = require("url");

class MiniRouter {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      PATCH: {},
      DELETE: {},
    };

    this.middlewares = [];
    this.basePath = "";
  }

  register(method, path, handlers) {
    const newPath = this.basePath + path;
    this.routes[method][newPath] = handlers;
  }

  get(path, ...handlers) {
    this.register("GET", path, handlers);
  }

  post(path, ...handlers) {
    this.register("POST", path, handlers);
  }

  put(path, ...handlers) {
    this.register("PUT", path, handlers);
  }

  patch(path, ...handlers) {
    this.register("PATCH", path, handlers);
  }

  delete(path, ...handlers) {
    this.register("DELETE", path, handlers);
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {

      const parsedUrl = url.parse(req.url, true);

      const method = req.method;
      const path = parsedUrl.pathname;
      req.query = parsedUrl.query;

      let routeHandlers = null;

      res.setHeader("Content-Type", "application/json");

      for (const [routePath, handlers] of Object.entries(this.routes[method])) {
        const params = this.getParams(routePath, path);
        if (params) {
          req.params = params;
          routeHandlers = handlers;
          break;
        }
      }
      
      if (!routeHandlers) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Route not found" }));
      }

      this.parseBody(req, () => {
        const allHandlers = [...this.middlewares, ...routeHandlers];
        this.runHandlers(allHandlers, req, res);
      });
    });

    server.listen(port, callback);
  }

  use(handler) {
    this.middlewares.push(handler);
  }

  parseBody(req, handle) {
    if (!["POST", "PUT", "PATCH"].includes(req.method)) {
      req.body = {};
      return handle();
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
      handle();
    });
  }

  runHandlers(handlers, req, res) {
    let index = 0;
    const next = () => {
      const handler = handlers[index++];
      if (handler) {
        handler(req, res, next);
      }
    };
    next();
  }

  getParams(cachedPath, reqPath) {
    const cachedSplit = cachedPath.split('/');
    const reqSplit = reqPath.split('/');
  
    if (cachedSplit.length !== reqSplit.length) {
      return null;
    }
  
    const param = {}

    for (let i = 0; i < cachedSplit.length; i++) {
      if (cachedSplit[i].startsWith(':')) {
        const paramName = cachedSplit[i].slice(1);
        param[paramName] = reqSplit[i];
      } else if (cachedSplit[i] !== reqSplit[i]) {
        return null;
      }
    }
  
    return param;
  }
}

module.exports = MiniRouter;