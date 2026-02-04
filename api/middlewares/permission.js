const Enum = require("../config/Enum");
const CustomError = require("../lib/Error");

module.exports = (requiredPermission) => {

    return (req, res, next) => {
        if(!req.user.permissions.includes(requiredPermission)){
            throw new CustomError(
                Enum.HTTP_CODES.FORBIDDEN,
                "Forbidden",
                "You don't have permission for this action"
            );
        }

        next();
    };
};