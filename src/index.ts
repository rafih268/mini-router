import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Handler = (
  req: IncomingMessage & { body?: any; params?: Record<string, string>; query?: any },
  res: ServerResponse,
  next: () => void,
) => void;

export default class MiniRouter {
  private routes: Record<HttpMethod, Record<string, Handler[]>>;
  private middlewares: Handler[];
  private basePath: string;

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

  register(method: HttpMethod, path: string, handlers: Handler[]) {
    let newPath = this.basePath + path;
    if (newPath !== "/" && newPath.endsWith("/")) {
      newPath = newPath.slice(0, -1);
    }
    this.routes[method][newPath] = handlers;
  }

  get(path: string, ...handlers: Handler[]) {
    this.register("GET", path, handlers);
  }

  post(path: string, ...handlers: Handler[]) {
    this.register("POST", path, handlers);
  }

  put(path: string, ...handlers: Handler[]) {
    this.register("PUT", path, handlers);
  }

  patch(path: string, ...handlers: Handler[]) {
    this.register("PATCH", path, handlers);
  }

  delete(path: string, ...handlers: Handler[]) {
    this.register("DELETE", path, handlers);
  }

  listen(port: number, callback: () => void) {
    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

      if (!req.url) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ message: "Bad request" }))
      }

      const parsedUrl = url.parse(req.url, true);

      const method = req.method?.toUpperCase() as HttpMethod;
      let path = parsedUrl.pathname || "/";
      if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1);
      }
      (req as any).query = parsedUrl.query;

      let routeHandlers = null;

      res.setHeader("Content-Type", "application/json");

      for (const [routePath, handlers] of Object.entries(this.routes[method])) {
        const params = this.getParams(routePath, path);
        if (params) {
          (req as any).params = params;
          routeHandlers = handlers;
          break;
        }
      }

      if (!routeHandlers) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Route not found" }));
      }

      this.parseBody(req, () => {
        const allHandlers = [...this.middlewares, ...routeHandlers!];
        this.runHandlers(allHandlers, req as any, res);
      });
    });

    server.listen(port, callback);
  }

  group(newBasePath: string, runGroupRoutes: (app: MiniRouter) => void) {
    const previousBase = this.basePath;
    this.basePath = this.basePath + newBasePath;

    runGroupRoutes(this);

    this.basePath = previousBase;
  }

  use(handler: Handler) {
    this.middlewares.push(handler);
  }

  parseBody(req: IncomingMessage, handle: () => void) {
    if (!["POST", "PUT", "PATCH"].includes(req.method || "")) {
      (req as any).body = {};
      return handle();
    }

    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        (req as any).body = body ? JSON.parse(body) : {};
      } catch {
        (req as any).body = {};
      }
      handle();
    });
  }

  runHandlers(handlers: Handler[], req: IncomingMessage, res: ServerResponse) {
    let index = 0;
    const next = () => {
      const handler = handlers[index++];
      if (handler) {
        handler(req, res, next);
      }
    };
    next();
  }

  getParams(cachedPath: string, reqPath: string): Record<string, string> | null {
    const cachedSplit = cachedPath.split('/');
    const reqSplit = reqPath.split('/');

    if (cachedSplit.length !== reqSplit.length) {
      return null;
    }
  
    const param: Record<string, string> = {}

    for (let i = 0; i < cachedSplit.length; i++) {

      const cachedPart = cachedSplit[i];
      const reqPart = reqSplit[i];

      if (cachedPart && reqPart && cachedPart.startsWith(':')) {
        const paramName = cachedPart.slice(1);
        param[paramName] = reqPart;
      } else if (cachedSplit[i] !== reqSplit[i]) {
        return null;
      }
    }
  
    return param;
  }
}