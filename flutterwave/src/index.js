const express = require("express");
const app = express();
const indexrouters = require("./routers/indexrouters");

app.use(express.json());
app.use(indexrouters);

app.listen(5002, () => {

    console.log("server started on port 5002");
});