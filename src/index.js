const express = require("express");
const app = express();
const indexrouters = require("./routers/indexrouters");

app.use(express.json());
app.use(indexrouters);

app.listen(process.env.PORT || 80, () => {

    console.log("server started on port 5002");
});
