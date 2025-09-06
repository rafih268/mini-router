export const getHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "GET request received" }));
};

export const getUserHandler = (req: any, res: any) => {
  res.end(JSON.stringify({
    message: "GET request received",
    userID: req.params.id,
    query: req.query
  }));
}

export const postHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "POST request received" }));
}

export const putHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "PUT request received", data: req.body }));
}

export const patchHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "PATCH request received", data: req.body }));
}

export const deleteHandler = (req: any, res: any) => {
  res.end(JSON.stringify({ message: "DELETE request received" }));
}