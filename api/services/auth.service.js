const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const Users = require("../db/models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const RefreshToken = require("../db/models/RefreshTokens");

class AuthService{

    static async login(data){

        if(!data.email || !data.password){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "All fields are required."
            );
        }

        const user = await Users
            .findOne({email: data.email})
            .select("+password");

        if(!user){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Email or password is incorrect"
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            data.password,
            user.password
        );

        if(!isPasswordCorrect){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Email or password is incorrect"
            );
        }

        const accessToken = jwt.sign(
            {id: user._id},
            config.JWT.SECRET,
            {
                expiresIn: config.JWT.ACCESS_EXPIRE
            }
        );

        const refreshToken = jwt.sign(
            {id: user._id},
            config.JWT.REFRESH_SECRET,
            {
                expiresIn: config.JWT.REFRESH_EXPIRE
            }
        );

        await RefreshToken.deleteMany({ user_id: user._id});

        await RefreshToken.create({
            user_id: user._id,
            token: refreshToken,
            expires_at: new Date(
                Date.now() + 7*24*60*60*1000
            )
        });

        const userObj = user.toObject();
        delete userObj.password;

        return {
            accessToken,
            refreshToken,
            user: userObj
        };
    }

    static async refresh(refreshToken){

        if(!refreshToken){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "Refresh token is required"
            );
        }

        const storedToken = await RefreshToken.findOne({ token: refreshToken});

        if(!storedToken){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Invalid refresh token"
            );
        }

        try{
            const decoded = jwt.verify(
                refreshToken,
                config.JWT.REFRESH_SECRET
            );

            const newAccessToken = jwt.sign(
                {id: decoded.id},
                config.JWT.SECRET,
                { expiresIn: config.JWT.ACCESS_EXPIRE}
            );

            return {
                accessToken: newAccessToken
            };

        } catch(err){
            throw new CustomError(
                Enum.HTTP_CODES.UNAUTHORIZED,
                "Unauthorized",
                "Refresh token expired"
            );
        }
    }

    static async logout(refreshToken){
        if(!refreshToken){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "Refresh token is required"
            );
        }

        await RefreshToken.deleteOne({ token: refreshToken });

        return { success: true };
    }
}

module.exports = AuthService;