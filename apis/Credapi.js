const exp=require("express")
const jwt=require("jsonwebtoken")
const Cryptr=require('cryptr')
const cryptr=new Cryptr('sdbfbfbkgbkbgkjbdgbdj')
CredApiRouter=exp()

CredApiRouter.use(exp.json())

const Verifier=(req,res,next)=>{
  let key="dbfbhsdbfjkkbsdkjfbhjijsdbfjnwjdf";
   let tokenWithBearer=req.headers['authorization']
   if(tokenWithBearer==undefined){
     return res.send({message:'login'})
   }
   if(tokenWithBearer.startsWith('Bearer ')){
     let token=tokenWithBearer.slice(7,tokenWithBearer.length)
     jwt.verify(token,key,(err,decoded)=>{
       if(err){
         return res.send({message:"session"})
       }
       else{
         next();
       }
     })
   }
}

CredApiRouter.get('/home',Verifier,(req,res)=>{
     res.send({message:"success"})
})

CredApiRouter.get('/add',Verifier,(req,res)=>{
     res.send({message:"success"})
})

CredApiRouter.get('/edit',Verifier,(req,res)=>{
  res.send({message:"success"})
})

CredApiRouter.post('/addCred/:username',(req,res)=>{
  let username=req.params['username']
  let credObj=req.body
  let dbObj=req.app.set('dbObj')
  dbObj.collection(username).findOne({platform:{$eq:credObj.platform}})
  .then((credObjFromDb)=>{
      if(credObjFromDb!=null){
        res.send({message:"existed"})
      }
      else{
        let cryptedPassword=cryptr.encrypt(req.body.password)
        credObj.password=cryptedPassword
        dbObj.collection(username).insertOne(credObj)
        .then((result)=>{
             res.send({message:"success"})
        })
        .catch((err)=>{
          console.log("error in insertion",err)
        })
      }
  })
  .catch((err)=>{
    console.log("error in finding a credential",err)
  })
})

CredApiRouter.get('/getCred/:username',(req,res)=>{
  let username=req.params['username']
  let dbObj=req.app.set('dbObj')
  dbObj.collection(username).find().toArray()
  .then((credArray)=>{
    credArray=credArray.map((credObj)=>{
         let decryptedPassword=cryptr.decrypt(credObj.password)
         credObj.password=decryptedPassword
         return credObj
    })
    res.send({message:credArray})
  })
  .catch((err)=>{
    console.log("error in getting credentials",err)
  })
})

CredApiRouter.delete('/deleteCred/:username/:platform',(req,res)=>{
  let username=req.params['username']
  let platformFromClient=req.params['platform']
  let dbObj=req.app.set('dbObj')
  dbObj.collection(username).remove({platform:{$eq:platformFromClient}})
  .then((success)=>{
    res.send({message:"success"})
  })
  .catch((err)=>{
    console.log("error in deleting a credential",err)
  })
})

CredApiRouter.get('/getOneCred/:username/:platform',(req,res)=>{
  let username=req.params['username']
  let platformFromClient=req.params['platform']
  let dbObj=req.app.set('dbObj')
  dbObj.collection(username).findOne({platform:{$eq:platformFromClient}})
  .then((credObj)=>{
    let decryptedPassword=cryptr.decrypt(credObj.password)
    credObj.password=decryptedPassword
    res.send({message:credObj})
  })
  .catch((err)=>{
    console.log("error in getting a credential",err)
  })
})

CredApiRouter.put('/editCred/:username/:platform',(req,res)=>{
  let username=req.params['username']
  let platformFromClient=req.params['platform']
  let dbObj=req.app.set('dbObj')
  let credObj=req.body;
  let cryptedPassword=cryptr.encrypt(req.body.password)
  credObj.password=cryptedPassword
  dbObj.collection(username).update({platform:{$eq:platformFromClient}},{$set:{username:credObj.username,password:credObj.password}})
  .then((sucess)=>{
    res.send({message:"success"})
  })
  .catch((err)=>{
    console.log("error in editing credentials",err)
  })
})



module.exports=CredApiRouter;
