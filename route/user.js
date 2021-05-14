const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const webToken = require('../webtoken');

const key = require('../key');

router.route('/register').post((req,res)=>{
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
    });

    newUser.save().then(()=>{
        console.log("New User has been register.");
        res.json("Saved.");
    });
});

router.route('/fectchUser').get(webToken.checkToken, (req,res)=>{
    User.findOne({username: req.decoded.username},(err,result)=>{
        if(err){
            res.status(403).json(err);
        }else{
            res.status(200).json(result);
        }
        
    });
});

router.route('/login').post((req,res)=>{
    User.findOne({username: req.body.username},(err,result)=>{
        if(err){
            res.send(err);
        }else{
            if(result === null){
                res.status(403).json({msg: 'Invalid Account'});
            }else {
                if(result.password === req.body.password){
                    var token = jwt.sign({username :req.body.username},key.secretkey,{expiresIn:"1h"});
                    res.json({
                        token : token,
                        msg : "success",
                    });
                }else{
                    res.json({msg:'Incorrect password'});
                }
            }
        }
    });
});

router.route('/friends').get(webToken.checkToken,(req,res)=>{
    User.find({username : {$ne : req.decoded.username}}).then((result)=>{
        res.json(result);
    })
});

router.route('/checkAccount/:email').get((req,res)=>{
    User.findOne({email:req.params.email}).then((result)=>{
        if(result != null){
            res.json({
                msg:false
            });
        }else{
            res.json({
                msg: true
            });
        }  
    });
});

router.route('/userList').get((req,res) =>{
    User.find().then((result)=>{
        res.json(result);
    }).catch((err)=>{
        res.send(err);
    });
});

router.route('/updateUser/:id').patch((req,res)=>{
    User.findByIdAndUpdate({_id: req.params.id},
        {$set : {username:req.body.username,email:req.body.email}},
        (err,result)=>{
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        }
    );
});

module.exports = router;