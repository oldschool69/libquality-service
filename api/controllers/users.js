const jwt = require('jsonwebtoken');

module.exports = app => {
    const controller = {}

    controller.userLogin = (req, res, next) => {

        if(req.body.user === 'Flavio' && req.body.pwd === '123456') {
            //retrieve Id from db
            const id = 1
            var token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: parseInt(process.env.TOKEN_TIMEOUT)
            })
            return res.json({auth: true, token: token})
        }
        res.status(500).json({message: "Login failure, check your credentials "})
    }

    return controller
}