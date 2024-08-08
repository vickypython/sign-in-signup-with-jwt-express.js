const express = require("express");
const { signIn, signUp } = require("../controllers/authController.js");
const verifyingToken = require("../middleware/Open authJWT.js");
const router = express.Router();
router.post("/register", signUp);
router.post("/login", signIn);
router.get('/hidden',verifyingToken,function(req,res) {
    if(!user){
        res.status(403).send({message:"invalid jsonwebtoken"})
    }
    if(req.user==='admin'){
        res.status(200).send({message:'congratulation!'})
    }else{
        res.status(403).send({
            message:'unauthorised access'
        })
    }
})
module.exports = router;
