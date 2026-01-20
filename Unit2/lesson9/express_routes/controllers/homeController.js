exports.sendReqParam = (req, res) => {
  let veg = req.params.vegetable;
  console.log("Params: ", req.params);

  res.send(`This is the page for ${veg}`);
};

exports.sendPostReq = (req, res) => {
  console.log("Body: ", req.body);
  console.log("Query: ", req.query);
  res.send("POST Successful!");
};
