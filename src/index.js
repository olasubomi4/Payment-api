const express = require("express");
const app = express();
const indexrouters = require("./routers/indexrouters");

app.use(express.json());

app.use(indexrouters);
const errorHandler = require('./error/errorHandler');
app.post('/', (req, res, next) => {
  const {
    msg
  } = req.body;
  if (!msg) {
    next(ApiErrorClass.invalidRequest('Msg not present'));
  } else {
    res.send(msg)
  }
})
app.use(errorHandler);

app.listen(80, () => {

    console.log("server started on port 80");
});
