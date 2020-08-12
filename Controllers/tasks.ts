import task_collection from '../DB/database_connection.ts'
import { Task } from '../types.ts'

// @desc    Validate Product
const validateTask = async ({ request, response }: { request: any, response: any }) => {    
    const body = await request.body()
    let message = ''
    let data : any= {}
                    
    if (!request.hasBody) {
        message += 'No Data'
    } else {
        if (body.value.name == undefined || body.value.name == ''){
            message += 'Task Name Required' 
        }else if (body.value.description == undefined || body.value.description == ''){
            message += 'Task Description Required' 
        }
    }
    //If message exist that returns that data is not valid.                
    if(message){
        data.valid = false
        data.status = 400
        data.body = {
            success: false,
            data: message
        }
        return data    
    }
    data.valid = true 
    return data
}


// @desc    Add task
// @route   Post /api/v1/tasks
const addTask = async ({ request, response }: { request: any, response: any }) => {    
    const body = await request.body()
    // call the validateTask function which we create above to validate the request
    const validation = await validateTask({request, response})
    // if data is valid then add task otherwise returns the error message
    if(!validation.valid){
        response.status = validation.status
        response.body = validation.body
    }else {
        const task: Task = body.value
        const insertId = await task_collection.insertOne(task);
        response.status = 201
        response.body = {
            success: true,
            data: task
        }
    }
}

// @desc    Get all tasks
// @route   GET /api/v1/tasks
const getTasks = async({ response }: { response: any }) => {
    const getAllTask = await task_collection.find({});
    response.body = getAllTask;
}

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
const getTask = async({ params, response }: { params: { id: string }, response: any }) => {
    const task = await task_collection.findOne({ _id: {$oid : params.id} });
    //If task exist with id then returns task data otherwise returns error message           
    if (task) {
        response.status = 200
        response.body = {
            success: true,
            data: task
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            message: 'Task not found'
        }
    }
}

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
const deleteTask = async({ params, response }: { params: { id: string }, response: any }) => {
    const task = await task_collection.findOne({ _id: {$oid : params.id} });
    //If task exist with this id then remove it otherwise display error message            
    if (task) {
        await task_collection.deleteOne({ _id: {$oid : params.id} });
                
        response.status = 200
        response.body = { 
            success: true,
            message: 'Task removed'
        }
    } else {
        response.status = 404
        response.body = {
            success: false,
            message: 'Task not found'
        }
    }
}

const updateTask = async({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
    const body = await request.body()
    let message = ''
    let success = false
    if (!request.hasBody) {
        response.status = 404
        response.body = {
            success: false,
            message: 'No Data'
        }
    }else{
        const updateData: { name?: string; description?: string } = body.value
        //In mongoDB, updateOne() returns { 
            //matchedCount: Any data find with defined conditions or not , 
            //modifiedCount: Any data updated with on defined conditions or not, 
            //upsertedId: If data not exist with this conditions then new record inserted or not
        //} you can check more information at mongoDb query documentation.
        const { matchedCount, modifiedCount, upsertedId } = await task_collection.updateOne(
            { _id: {$oid : params.id} },
            { $set: updateData }
        );
        if (matchedCount == 0){
            message += 'Task Not Found'
        }else{
            message += 'Task Updated'
            success = true
        }
        response.status = 200
        response.body = {
            success: success,
            message: message
        }
    }
}

export { addTask, getTasks, getTask, deleteTask, updateTask }
