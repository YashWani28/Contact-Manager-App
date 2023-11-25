const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async(req,res,next) => {
    let token;
    
    // while sending requests from client, create Authorization header in headers and add the jwt token as its value
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer"))
    {
        token = authHeader.split(" ")[1];
        // verify needs the token, the secret key and a call back function
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err)
            {
                res.status(401);
                throw new Error("User is not authorized");

            }
            // req.user makes this information accessible to downstream middleware or route handlers.
            // By doing this, subsequent route handlers or middleware in the request-response cycle can easily access the user information without having to re-parse the JWT.
            req.user = decoded.user;
            next();
        });
        if(!token)
        {
            res.status(401);
            throw new Error("Token is missing")
        }
    }
})

module.exports = validateToken;