# Mini Router

A lightweight Node.js HTTP routing package built from scratch using the native `http` module.

---

## Features
- Supports **five HTTP methods**: GET, POST, PUT, PATCH, DELETE
- Request body parsing for JSON requests
- Organised **controllers** for maintainable code
- Chained middleware functions
- Supports router parameters
- Supports route query strings

## Installation

Clone the repository:
```bash
git clone https://github.com/<your-username>/mini-router.git
cd mini-router
```

Run `npm install` for any dependencies.

## Usage

1. Create route handlers in `controllers/`

```bash
exports.getHandler = (req, res) => {
  res.end(JSON.stringify({ message: "GET request received"}));
};
```

2. Add middleware functions in `middlewares/`

```bash
exports.middlewareOne = (req, res, next) => {
  // Middleware Task ...
  next();
}
```

3. Register routes in `server.js`

```bash
app.get("/api", <applicable-middleware>, <controller-file-name>.getHandler);
```

**NOTE: Download Postman to test the routes**

## How it works
- Routes are stored internally in an object like:
```bash
{
  GET: { "/path": handlerFunctions },
  POST: { "/path": handlerFunctions }
}
```

- When a request comes in:
1. The HTTP method and path are matched against the stored routes.
2. If the route exists, the request body of the request is stored.
3. Finally, the handler functions are executed.

## Learning Outcome

This project has allowed me to understand the internals of routing in Node.js:
- Direct use of Node's http module.
- Manual body parsing.
- Explicit route matching.
- Explicit chaining of middleware functions.
- Identifying route parameters and assigning them to `req.params`.
- Parsing query strings and assigning them to `req.query`.

## Git Respository Structure
- `main` branch -> All reviewed code.
- `dev` branch -> All development work.

## Licence
> MIT Licence