const Records = require("../db/models/Records");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

class RecordService{

    static async create(data, userId){

        if(!data.title){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Title field must be filled"
            );
        }

        const record = await Records.create({

            title: data.title,
            description: data.description,
            user_id: userId,
            status: Enum.RECORD_STATUS.OPEN
        });

        return record;
    }

    static async list(query, userId){

        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 2;

        if(page < 1) page = 1;
        if(limit < 1) limit = 2;

        const skip = (page - 1) * limit;

        const filter = {
            user_id: userId
        };

        if(query.status){
            filter.status = query.status;
        }

        if(query.title){
            filter.title = { $regex: query.title, $options: "i"};
        }

        if(query.startDate || query.endDate){
            filter.created_at = {};

            if(query.startDate){
                filter.created_at.$gte = new Date(query.startDate);
            }

            if(query.endDate) {
                filter.created_at.$lte = new Date(query.endDate);
            }
        }

        const records = await Records.find(filter)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await Records.countDocuments(filter);

        return {
            records,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    }

    static async getById(id, userId){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Validation Error!",
                "record id is required."
            );
        }

        const record = await Records.findById(id);

        if(!record){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "Record not found"
            )
        }

        if(record.user_id !== userId){
            throw new CustomError(
                Enum.HTTP_CODES.FORBIDDEN,
                "Forbidden",
                "You do not have access to this record"
            );
        }

        return record;
    }

    static async update(id, data, userId){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "id must be filled"
            );
        }

        const record = await Records.findById(id);

        if(!record){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "Record not found"
            );
        }

        if(record.user_id.toString() !== userId){
            throw new CustomError(
                Enum.HTTP_CODES.FORBIDDEN,
                "Forbidden",
                "You cannot update this record"
            );
        }

        const updates = {};

        if(data.title) updates.title = data.title;
        if(data.description) updates.description = data.description;
        if(data.status) updates.status = data.status;

        if(Object.keys(updates).length === 0){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "At least one field must be provided to update"
            );
        }

        const updatedRecord = await Records.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        return updatedRecord;
    }

    static async delete(id, userId){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id is required"
            );
        }

        const record = await Records.findById(id);

        if(!record){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "Record not found"
            );
        }

        if(record.user_id.toString() !== userId){
            throw new CustomError(
                Enum.HTTP_CODES.FORBIDDEN,
                "Forbidden",
                "You cannot delete this record"
            );
        }

        const deletedRecord = await Records.findByIdAndDelete(id);

        return deletedRecord;

    }
}

module.exports = RecordService;