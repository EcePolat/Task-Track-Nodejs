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
            status: Enum.RECORD_STATUS.OPEN
        });

        return record;
    }

    static async list(){

        const records = await Records.find().sort({ created_at: -1 });

        return records;
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