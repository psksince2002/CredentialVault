const exp=require("express")
const bcryptjs=require("bcryptjs")
const jwt=require("jsonwebtoken")
const UserApiRouter=exp.Router()

UserApiRouter.use(exp.json())

UserApiRouter.post("/createUser", (req,res)=>{
  let userObj=req.body
  let dbObj=req.app.get('dbObj')
  dbObj.collection('usercollection').findOne({username:{$eq:userObj.username}})
  .then((userObjFromDb)=>{
    if(userObjFromDb!=null){
      res.send({message:"existed"})
    }
    else{
       bcryptjs.hash(userObj.password,6)
       .then(hashedpw=>{
         userObj.password=hashedpw
         dbObj.collection('usercollection').insertOne(userObj)
         .then(success=>{
             dbObj.createCollection(userObj.username)
             .then(success=>{
              res.send({message:"success"})
             })
             .catch(err=>{
               console.log("error in creating collection",err)
             })
         })
         .catch((err)=>{
           console.log("error received at inserting a record",err)
         })
       })
       .catch((err)=>{
         console.log("error occured in hashing",err)
       })
    }
  })
  .catch((err)=>{
    console.log("error received at finding a user",err)
  })

})

UserApiRouter.post('/logUser',(req,res)=>{
  let key="dbfbhsdbfjkkbsdkjfbhjijsdbfjnwjdf";
  let userObj=req.body;
  let dbObj=req.app.get('dbObj')
  dbObj.collection('usercollection').findOne({username:{$eq:userObj.username}})
  .then((userObjFromDb)=>{
      if(userObjFromDb==null){
        res.send({message:"no username"})
      }
      else{
        bcryptjs.compare(userObj.password,userObjFromDb.password)
        .then((result)=>{
          if(result==false){
            res.send({message:"invalid password"})
          }
          else{
            jwt.sign({username:userObj.username},key,{expiresIn:600},(err,signedToken)=>{
                if(err){
                  console.log("error in creating signedtoken",err)
                }
                else{
                  res.send({message:"success",jwt:signedToken,username:userObj.username})
                }
            })
          }
        })
        .catch((err)=>{
          console.log("error in comparing passwords",err)
        })
      }
  })
  .catch((err)=>{
    console.log("error in finding username",err)
  })
})

module.exports=UserApiRouter;
