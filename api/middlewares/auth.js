const jwt = require("jsonwebtoken");
const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");
const config = require("../config");
const Users = require("../db/models/Users");

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader) {
        throw new CustomError(
            Enum.HTTP_CODES.UNAUTHORIZED,
            "Unauthorized",
            "Authorization header is missing"
        );
    }

    const [type, token] = authHeader.split(" ");

    if(type !== "Bearer" || !token) {
        throw new CustomError(
            Enum.HTTP_CODES.UNAUTHORIZED,
            "Unauthorized",
            "Invalid authorization format"
        );
    }

    try{

        const decoded = jwt.verify(token, config.JWT.SECRET);

        const user = await Users.findById(decoded.id).populate("role_id");

        if(!user || !user.role_id){
            throw new CustomError(
                Enum.HTTP_CODES.FORBIDDEN,
                "Forbidden",
                "User role not assigned"
            );
        }

        req.user = {
            id: user._id,
            role: user.role_id.name,
            permissions: user.role_id.permissions
        };

        next();
        
    } catch(err){
        throw new CustomError(
            Enum.HTTP_CODES.UNAUTHORIZED,
            "Unauthorized",
            "Invalid or expired token"
        );
    }
}