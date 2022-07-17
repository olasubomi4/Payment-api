const { request, response } = require("express");
const express = require("express");
const { throwResponseError } = require("web-request");
const {Router} =express;
const router = new Router();

router.use(express.json());
router

.route("/split-payments/compute")

.post((req,res)=> {
    //checks splitinfo size
    console.log(request.statusCode);
    try
    {
      if(!req.body.ID || !req.body.Amount || !req.body.Currency || !req.body.CustomerEmail || !req.body.SplitInfo)
      {
      res.send("A required json body is missing");
      }
     else
      {
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
                
              
              if( req.body.SplitInfo[s].SplitValue > usersRequest.Amount)
              {
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
                if (checkamountFlat > balance){
                  
                    res.send(" Split Amount cannot be greater than the transaction Amount ");
                    res.end();
                }
                else
                {
                var checkamountFlat = usersRequest.SplitInfo[i].SplitValue;
                }
                if(checkamountFlat<0 ||(checkamountFlat.toString().match(/e/)))
                {
                    res.send("Split Amount cannot be lesser than 0");
                } 
               
                else
                {
                  console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":  ${usersRequest.SplitInfo[i].SplitValue}`)
                
                  usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId,Amount:usersRequest.SplitInfo[i].SplitValue});
                  console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - ${usersRequest.SplitInfo[i].SplitValue})`);
                  balance=balance - usersRequest.SplitInfo[i].SplitValue;
                  console.log(`${balance} \n`);
                }
              }
            }

            //Checks for Percentage SplitType
            console.log("PERCENTAGE TYPES COME NEXT");
            for(var i = 0; i < usersRequest.SplitInfo.length; i++)
            {
    

              if(usersRequest.SplitInfo[i].SplitType=="PERCENTAGE")
              {
                if (checkamountPercentage > balance)
                {
                  
                  res.send(" Split Amount cannot be greater than the transaction Amount");
                  res.end();
                }
                else
                {
                var checkamountPercentage= ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01);
              
                }
                
                if(checkamountPercentage < 0 ||( checkamountPercentage.toString().match(/e/)))
                {
                    res.send("Split amount cannot be lesser than 0");
                    res.end();
                }
                else
                {
                console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":(${usersRequest.SplitInfo[i].SplitValue} OF ${balance}) = ${((balance * usersRequest.SplitInfo[i].SplitValue)*0.01)}`)
                usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId,Amount: ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01)});
                console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - (${((balance * usersRequest.SplitInfo[i].SplitValue)*0.01)}))`);
                balance=balance - ((balance * usersRequest.SplitInfo[i].SplitValue)*0.01);
                console.log(`${balance} \n`);
                }
              }
            }
          
          //Gets the sum of all Ratio splitType
          console.log("FINALLY, RATIO TYPES ");
          for(var i = 0; i < usersRequest.SplitInfo.length; i++)
          {

            if(usersRequest.SplitInfo[i].SplitType=="RATIO")
            {
              ratio_size= ratio_size+usersRequest.SplitInfo[i].SplitValue;
               var ratioBalance=balance
              } 

          }

            //Checks for Ratio SplitType
            console.log(`Opening Ratio Balance = ${balance} \n`);
            for(var i = 0; i < usersRequest.SplitInfo.length; i++)
            { 
              if(usersRequest.SplitInfo[i].SplitType=="RATIO")
              {
                var checkamountRatio=((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance);
               
              if (checkamountRatio > ratioBalance)
                {
                
                  res.send(" Split Amount cannot be greater than the transaction Amount");
                  res.end();
                
                }
               
                  // let tes = (ratiovalue,ratiototal,ratiobalance) => console.log (parseFloat(((ratiovalue/ratiovalue)*ratiobalance)).toFixed(2));
                   
               
                  if(checkamountRatio<0 ||( checkamountRatio.toString().match(/e/) ))
                  {
                    res.send("Amount cannot be lesser than 0");
                  }
                  else
                  {
                    console.log(`Split amount for "${usersRequest.SplitInfo[i].SplitEntityId}":((${usersRequest.SplitInfo[i].SplitValue}/${ratio_size}) * ${ratioBalance}) = ${ ((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)}`)
                    usersSplitRequest.SplitBreakDown.push({SplitEntityId:usersRequest.SplitInfo[i].SplitEntityId, Amount: ((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)});
                    console.log(`Balance after split calculation for "${usersRequest.SplitInfo[i].SplitEntityId}": (${balance} - (${((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance)}))`);
                    balance= balance- ((usersRequest.SplitInfo[i].SplitValue/ratio_size)*ratioBalance);
                    console.log(`${balance} \n`);

                    
                  }
                
              }
      
            }
      
          
          
            //Ensures that balance is not lesser than 0 and the sum of split breakdown isn't higher than the initial amount
            if(balance < 0||( balance.toString().match(/e/) != null))
            {

            res.send("Balance cannot be lesser than 0");
            }
            else
            {
              console.log(`Final Balance: ${balance}\n `)
              usersSplitRequest.Balance=balance;
              var splitBreakdownSum=0
              for(var i = 0; i <  usersSplitRequest.SplitBreakDown.length; i++)
              {
                splitBreakdownSum=splitBreakdownSum+ usersSplitRequest.SplitBreakDown[i].Amount;
                console.log(splitBreakdownSum)
              }
              
                if(splitBreakdownSum >usersRequest.Amount)
              {
                  res.send(" Split amount sum is higher than your transaction amount");
                  res.end();
                }
              else{
                  console.log(usersSplitRequest);

                res.json(usersSplitRequest);
                }
            }
          
          
        }
      
        else
        {
        res.send("The SplitInfo is too High, It must be between 1 and 20");
        }

      }
   }
    catch
    {
    console.log("One of the constraints caught an error ")
    }
  }
);
module.exports = router;
 