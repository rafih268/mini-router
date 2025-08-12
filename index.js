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
}