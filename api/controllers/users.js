const jwt = require('jsonwebtoken');
const db = require('../../config/database');

module.exports = app => {
    const controller = {}

    controller.userLogin = (req, res, next) => {

        const infoemedAccount = req.body.user;
        const informedPwd = req.body.pwd;  
        
        db.GetUserInfo(infoemedAccount, (error, result) => {
            console.log(result)
            if (result == null || result.length == 0) {
                return res.status(500).json({message: "Login failure, user not found"})    
            }
            if(infoemedAccount === result[0].user_account 
                && informedPwd === result[0].user_pwd) {
                const id = result[0].user_id
                var token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: parseInt(process.env.TOKEN_TIMEOUT)
                })
                return res.json({auth: true, token: token})
            }
            res.status(500).json({message: "Login failure, wrong user or pasword"})
        })
    }

    return controller
}