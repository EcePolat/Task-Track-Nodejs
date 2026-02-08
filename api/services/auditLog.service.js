const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLog = require("../db/models/AuditLogs");

class AuditLogService {

    static async log({userId, action, entity, entityId = null, detail}){
        if(!userId){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "All field are required"
            );
        }

        return AuditLog.create({
            user_id: userId,
            action,
            entity,
            entity_id: entityId,
            detail
        });
    }

}

module.exports = AuditLogService;