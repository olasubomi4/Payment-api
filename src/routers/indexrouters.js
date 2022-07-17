const express = require("express");
const {Router} =express;
const router = new Router();


router

.route("/split-payments/compute")
.post((req,res)=> {
    //checks splitinfo size
    if (req.body.SplitInfo.length<=0||!req.body.SplitInfo[0].SplitValue)
    {

    res.send("The SplitInfo is too Low, It must be between 1 and 20");
    }
    else if(req.body.SplitInfo.length > 0 && req.body.SplitInfo.length<20 )
    { 
       
        var usersRequest= ({ID: parseInt(req.body.ID),Amount : parseInt(req.body.Amount),Currency:req.body.Currency,CustomerEmail: req.body.CustomerEmail,SplitInfo:[] });
      
        var balance=usersRequest.Amount;
        let ratio_size= 0;
        for(var s = 0; s < req.body.SplitInfo.length;s++)
        {
            
           
           if( req.body.SplitInfo[s].SplitValue > usersRequest.Amount){
            res.send("Split Amount is greater than Amount")
           } 
            usersRequest.SplitInfo.push({SplitType:req.body.SplitInfo[s].SplitType,SplitValue: parseInt(req.body.SplitInfo[s].SplitValue), SplitEntityId: req.body.SplitInfo[s].SplitEntityId})
         
       };

      //Creates response template.
      var usersSplitRequest=({ID: usersRequest.ID,Balance : balance,SplitBreakDown:[] }); 
      console.log(`Initial Balance: \n${balance} \n`)
      //Checks for Flat SplitType
   
      console.log("FLAT TYPES FIRST");
      for(var i = 0; i < usersRequest.SplitInfo.length; i++)
      {
        if(usersRequest.SplitInfo[i].SplitType=="FLAT")
        {
            if ( usersRequest.SplitInfo[i].SplitValue > balance){
                res.send(" Split Amount cannot be greater than the transaction Amount ");
            }
            var checkamountFlat=balance - usersRequest.SplitInfo[i].SplitValue;
            if(checkamountFlat<0){
                res.send("Amount cannot be lesser than 0");
            } 
            console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":  ${usersRequest.SplitInfo[i].SplitValue}`)
            
          usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId,Amount: balance - usersRequest.SplitInfo[i].SplitValue});
          console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - ${usersRequest.SplitInfo[i].SplitValue})`);
          balance=balance - usersRequest.SplitInfo[i].SplitValue;
          console.log(`${balance} \n`);
        }
     }

     //Checks for Percentage SplitType
     console.log("PERCENTAGE TYPES COME NEXT");
     for(var i = 0; i < usersRequest.SplitInfo.length; i++)
        {
    
          if(usersRequest.SplitInfo[i].SplitType=="PERCENTAGE")
          {
            if ( usersRequest.SplitInfo[i].SplitValue > balance)
            {
                res.send(" Split Amount cannot be greater than the transaction Amount");
            }
            var checkamountPercentage= ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01);

            if(checkamountPercentage<0)
            {
                res.send("Amount cannot be lesser than 0");
            }
            console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":(${usersRequest.SplitInfo[i].SplitValue} OF ${balance})`)
            usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId,Amount: ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01)});
            console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - (${((balance * usersRequest.SplitInfo[i].SplitValue)*0.01)}))`);
            balance=balance - ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01);
            console.log(`${balance} \n`);
          }
        }
      
      //Gets the sum of all Ratio splitType
      console.log("FINALLY, RATIO TYPES ");
     for(var i = 0; i < usersRequest.SplitInfo.length; i++)
     {

        if(usersRequest.SplitInfo[i].SplitType=="RATIO")
        {
        ratio_size= ratio_size+usersRequest.SplitInfo[i].SplitValue;
        var ratioBalance=balance;
        } 

     }

      //Checks for Ratio SplitType
      console.log(`Opening Ratio Balance = ${ratioBalance} \n`);
      for(var i = 0; i < usersRequest.SplitInfo.length; i++)
      { 

        if(usersRequest.SplitInfo[i].SplitType=="RATIO")
        {
          if ( usersRequest.SplitInfo[i].SplitValue > balance)
            {
              res.send(" Split Amount cannot be greater than the transaction Amount ");
            }
          
        // let tes = (ratiovalue,ratiototal,ratiobalance) => console.log (parseFloat(((ratiovalue/ratiovalue)*ratiobalance)).toFixed(2));
      
          var checkamountRatio=((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance);
          if(checkamountRatio<0)
          {
              res.send("Amount cannot be lesser than 0");
          }
          console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":(${usersRequest.SplitInfo[i].SplitValue}/${ratio_size}) * ${balance}))`)
          usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId, Amount: ((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)});
          console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - (${((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)}))`);
          balance= balance- ((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance);
          console.log(`${balance} \n`)
        }
  
      }
      var splitSum=0
      for(var i = 0; i < usersSplitRequest.SplitBreakDown.length; i++)
      {
         splitSum=splitSum+usersSplitRequest.SplitBreakDown[i].Amount;
      }
     
      if(splitSum >usersRequest.Amount)
      {
        res.send("Invalid request the sum of your split breakdown amount is higher than your transaction amount")
      }
      //Ensures that balance is not lesser than 0
      if(balance<0)
      {

      res.send("Balance cannot be lesser than 0");
      }
      else
      {
       console.log(`Final Balance: ${balance}\n `)
       usersSplitRequest.Balance=balance;
      }

      console.log(usersRequest);

      res.json(usersSplitRequest);
    }

    else
    {
    res.send("The SplitInfo is too High, It must be between 1 and 20");
    }
  }
);
module.exports = router;
 