const Records = require("../db/models/Records");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

class RecordService{

    static async create(data){

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
            user_id: data.user_id,
            status: Enum.RECORD_STATUS.OPEN
        });

        return record;
    }

    static async list(query){

        let page = parseInt(query.page) || 1;
        let limit = parseInt(query.limit) || 2;

        if(page < 1) page = 1;
        if(limit < 1) limit = 2;

        const skip = (page - 1) * limit;

        const filter = {};

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

    static async getById(id){

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

        return record;
    }

    static async update(id, data){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "id must be filled"
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

        if(!updatedRecord){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found",
                "Record not found"
            );
        }

        return updatedRecord;
    }

    static async delete(id){

        if(!id){
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error",
                "id is required"
            );
        }

        const deletedRecord = await Records.findByIdAndDelete(id);

        if(!deletedRecord){
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not found",
                "Record not found"
            );
        }

        return deletedRecord;

    }
}

module.exports = RecordService;