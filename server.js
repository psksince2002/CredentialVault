
const exp=require("express")
const mc=require("mongodb").MongoClient;
const path=require("path")
let dbObj;
const dburl="mongodb://koushik:sa07@backendcluster-shard-00-00.sk4ik.mongodb.net:27017,backendcluster-shard-00-01.sk4ik.mongodb.net:27017,backendcluster-shard-00-02.sk4ik.mongodb.net:27017/CredVault?ssl=true&replicaSet=atlas-13jwai-shard-0&authSource=admin&retryWrites=true&w=majority"
const app=exp()

mc.connect(dburl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(client=>{
    dbObj=client.db("CredVault")
    app.set('dbObj',dbObj)
    console.log('connected to db successfully')
})
.catch(err=>{
    console.log("error in the db connection",err)
})

UserApiRouter=require("./apis/UserApi");
CredApiRouter=require('./apis/Credapi');

app.use('/user',UserApiRouter)
app.use('/cred',CredApiRouter)

app.use(exp.json())

app.use(exp.static(path.join(__dirname,"dist/CredentialVault")))

app.use((req,res,next)=>{
    res.send({message:`the requested path ${req.url} does not exists`})
})

const port=5000

app.listen(port,()=>{
    console.log(`listening on ${port}`)
})
