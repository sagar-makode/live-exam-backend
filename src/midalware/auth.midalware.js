
const jwt = require('jsonwebtoken')


const verifyJWT = async (req, res, next) =>{
    try {

        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer", "")
       
  
        if(!token){
            return res.status(403).json({ message: 'No token provided' });
        }
        // const tokens = req.headers.authorization.trim().split(' ')[1];
    
        const decodedToken = jwt.verify(token, "mykey")

      // Verify token
      req.userId = decodedToken.userId

      next();
    } catch (error) {
        console.error(error)
    }
}

module.exports = verifyJWT;