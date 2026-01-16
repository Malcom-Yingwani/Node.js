const port = 3000;

// require Express.js by referring to the module name express and storing it as a constant. express offers a library of methods and functionality, including a class with builtin web server functionality
const express = require("express");

const app = express(); // returns and express instance/app. Gives acces to methods from express

app.get("/", (req, res) => {
 console.log("Params: ", req.params);
 console.log("Body: ", req.body);
 console.log("URL: ", req.url);
 console.log("query: ", req.query);
 res.send("<h1>Hello, Universe!</h1>");
})

// creates the server and waits for incoming requests
.listen(port, () => {
 console.log(`The Express.js server has started and is listening on port number: ${port}`);
});

