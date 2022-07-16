const express = require("express");
const {Router} =express;
const router = new Router();
const users= [];




router

.route("/split-payments/compute")
.post((req,res)=> {
    
    if (req.body.SplitInfo.length<=0||!req.body.SplitInfo[0].SplitValue){

    res.send("The SplitInfo is too Low, It must be between 1 and 20");
    }
    else if(req.body.SplitInfo.length > 0 && req.body.SplitInfo.length<20 ){ 
       
        var users= ({ID: parseInt(req.body.ID),Amount : parseInt(req.body.Amount),Currency:req.body.Currency,CustomerEmail: req.body.CustomerEmail,SplitInfo:[] });
        var respon2=({ID: parseInt(req.body.ID),Amount : parseInt(req.body.Amount),Currency:req.body.Currency,CustomerEmail: req.body.CustomerEmail,SplitInfo:[] });
        var balance=users.Amount;
        let ratio_size= 0;
        for(var s = 0; s < req.body.SplitInfo.length;s++){
            
           // if(s> 0&& s<20 ){
           if( req.body.SplitInfo[s].SplitValue > users.Amount){
            res.send("Split Amount is greater than Amount")
           } 
            users.SplitInfo.push({SplitType:req.body.SplitInfo[s].SplitType,SplitValue: parseInt(req.body.SplitInfo[s].SplitValue), SplitEntityId: req.body.SplitInfo[s].SplitEntityId})
            /*}
            else{
                    res.send("Invalid input");
                    throw new Error('Ran ouh of coffee');
            }
            */
    };
    
    var respon=({ID: users.ID,Balance : balance,SplitBreakDown:[] }); 
   for(var i = 0; i < users.SplitInfo.length; i++)
{
    var product = users.SplitInfo[i];
    var productName = product.SplitType;
    if(users.SplitInfo[i].SplitType=="FLAT")
    {
        if ( users.SplitInfo[i].SplitValue > balance){
            res.send(" Split Amount cannot be greater than the transaction Amount ");
        }
        var checkamountFlat=balance - users.SplitInfo[i].SplitValue;
        if(checkamountFlat<0){
            res.send("Amount cannot be lesser than 0");
        }

       respon.SplitBreakDown.push({SplitEntityId:users.SplitInfo[i].SplitEntityId,Amount: balance - users.SplitInfo[i].SplitValue});
       balance=balance - users.SplitInfo[i].SplitValue;
    }
    
  // console.log(users.SplitInfo[i].SplitType); 
}
for(var i = 0; i < users.SplitInfo.length; i++)
{
    var product = users.SplitInfo[i];
    var productName = product.SplitType;
    if(users.SplitInfo[i].SplitType=="PERCENTAGE")
    {
        if ( users.SplitInfo[i].SplitValue > balance){
            res.send(" Split Amount cannot be greater than the transaction Amount");
        }
        var checkamountPercentage= parseFloat(((balance * users.SplitInfo[i].SplitValue)*0.01)).toFixed(1);
        if(checkamountPercentage<0){
            res.send("Amount cannot be lesser than 0");
        }
       respon.SplitBreakDown.push({SplitEntityId:users.SplitInfo[i].SplitEntityId,Amount:  parseFloat(((balance * users.SplitInfo[i].SplitValue)*0.01)).toFixed(1)});
       balance=balance - ((balance * users.SplitInfo[i].SplitValue)*0.01);
    }
   
    
  // console.log(users.SplitInfo[i].SplitType); 
}
console.log(balance)

  // console.log(users.SplitInfo[i].SplitType); 
  for(var i = 0; i < users.SplitInfo.length; i++)
  {
   
      var product = users.SplitInfo[i];
      var productName = product.SplitType;
      if(users.SplitInfo[i].SplitType=="RATIO")
      {
      ratio_size= ratio_size+users.SplitInfo[i].SplitValue;
      var ratioBalance=balance
      }
      
    // console.log(users.SplitInfo[i].SplitType); 
  }


  for(var i = 0; i < users.SplitInfo.length; i++)
  { 
      var product = users.SplitInfo[i];
      var productName = product.SplitType;
      if(users.SplitInfo[i].SplitType=="RATIO")
     
      {
        if ( users.SplitInfo[i].SplitValue > balance){
            res.send(" Split Amount cannot be greater than the transaction Amount ");
        }

       // let tes = (ratiovalue,ratiototal,ratiobalance) => console.log (parseFloat(((ratiovalue/ratiovalue)*ratiobalance)).toFixed(2));
    
        var checkamountRatio=parseFloat(((users.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)).toFixed(2);
        if(checkamountRatio<0){
            res.send("Amount cannot be lesser than 0");
        }
        
        respon.SplitBreakDown.push({SplitEntityId:users.SplitInfo[i].SplitEntityId, Amount: parseFloat(((users.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)).toFixed(2)});
      
        balance= balance- ((users.SplitInfo[i].SplitValue/ratio_size)*ratioBalance);
 
    
      }
  
    
      
    // console.log(users.SplitInfo[i].SplitType); 
  }
  if(balance<0)
  {
    res.send("Balance cannot be lesser than 0");
  }
  else{
       respon.Balance=balance;
  }

console.log(users);
//users.SplitInfo[0].SplitEntityId={balance:5000};
    res.json(respon);
}

else{
    res.send("The SplitInfo is too High, It must be between 1 and 20");
}


});


/*router.post("/create_user",(req,res) => {
  
    const { user } = req.body;
    users.push({username: user.username,password: user.password});

    console.log(users);
    res.json({loggedIn : true,status: "Everything went well!"});
});
router.post("/test",(req,res) => {
  
    
    users.push({ID: req.body.Id,password:[{passwordsssss: req.body.passwordxss}]});

    console.log(users);
    res.json({loggedIn : true,status: "Everything went well!"});
});

router.get("/users",(req,res)=>{
  res.json(users);

})
router.delete("/delete", (req,res,next)=>{
    const {user} = req.body;
    
    const existingUser = users.find(u => u.username === user.username && u.password ===user.password);
    console.log(existingUser);

    if(!existingUser)
    {

        res.status(401).json({ errorStatus:"Credentials did not match"});
    }
    users.splice(users.indexOf(existingUser),1);
    res.json(users);
    }
);
*/
module.exports = router;
 