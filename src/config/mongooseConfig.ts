
import mongoose from 'mongoose';

const MongooseConnect = async ()=> {
    const connection = await mongoose.connect("mongodb+srv://alok28:alok108@alok.lpdwxfo.mongodb.net/gmail?&retryWrites=true&w=majority");
    if(connection){
        console.log('Connected to Mongoose server');
    }
}

export default MongooseConnect;