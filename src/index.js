const express = require("express");
const app = express();
const indexrouters = require("./routers/indexrouters");
const port = process.env.PORT || 80;

app.use(express.json());
app.use(indexrouters);
const PORT = 80;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);
