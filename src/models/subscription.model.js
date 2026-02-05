import mongoose, {Schema, schema} from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
     subscriber: {  // the user who is subscribing
        type: Schema.Types.ObjectId,  
        ref: 'User',
     },
     chennel: {   // the user who is being subscribed to
        type: Schema.Types.ObjectId,
        ref: 'User',
     }
});



export const Subscription= mongoose.model('Subscription', subscriptionSchema)