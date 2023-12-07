
import mongoose from 'mongoose';

const MongooseConnect = async ()=> {
    const connection = await mongoose.connect("");
    if(connection){
        console.log('Connected to Mongoose server');
    }
}

export default MongooseConnect;
