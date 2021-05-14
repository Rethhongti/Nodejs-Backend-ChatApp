const jwt = require('jsonwebtoken');
const key = require('./key');
let checkToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401)

    jwt.verify(token,key.secretkey , (err, decoded) => {
        console.log(err)
        if (err){
            return res.json(err);
        }else{
            req.decoded = decoded;
            next();
        }
        
    })
}

module.exports = {checkToken};