exports.getHandler = (req, res) => {
  res.end(JSON.stringify({ message: "GET request received" }));
};

exports.postHandler = (req, res) => {
  res.end(JSON.stringify({
    message: "POST request received",
    data: req.body,
    middlewareOneExecuted: req.middlewareOneExecuted,
    middlewareTwoExecuted: req.middlewareTwoExecuted
  }));
}

exports.putHandler = (req, res) => {
  res.end(JSON.stringify({ message: "PUT request received", data: req.body }));
}

exports.patchHandler = (req, res) => {
  res.end(JSON.stringify({ message: "PATCH request received", data: req.body }));
}

exports.deleteHandler = (req, res) => {
  res.end(JSON.stringify({ message: "DELETE request received" }));
}