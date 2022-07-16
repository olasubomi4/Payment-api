const express = require("express");
const app = express();
const indexrouters = require("./routers/indexrouters");
const port = process.env.PORT || 80;

app.use(express.json());
app.use(indexrouters);

app.listen(port , () => {

    console.log("server started on port 5002");
});
