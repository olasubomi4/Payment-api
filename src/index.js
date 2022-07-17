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

/*app.use((req,res,next) => {

    //const err = new Error(SyntaxError);
    res.status(404);
    res.send({
        error:"not found"
    });
    
})
app.use((env, req, res, next) => {
    res.status(err.status || 404);
    res.send({
        error:{
            status: err.status || 404,
            message: err.message
        }
    })
})
*/
app.listen(5002, () => {

    console.log("server started on port 80");
});