import 'express-async-errors'
import mongoose from 'mongoose';
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {PaymentCompletedListener} from "./events/listeners/payment-completed-listener";

const start = async () => {
    process.env.JWT_KEY = "amrmahmoud"
    if (!process.env.JWT_KEY){
        throw  new Error('jwt key doesnt exist');
    }
    if (!process.env.MONGO_UR){
        throw  new Error('Mongo url doesnt exist');
    }
    if (!process.env.NATS_URL){
        throw  new Error('NATS_URL doesnt exist');
    }
    if (!process.env.NATS_CLUSTER_ID){
        throw  new Error('NATS_CLUSTER_ID doesnt exist');
    }
    if (!process.env.NATS_CLIENT_ID){
        throw  new Error('NATS_CLIENT_ID doesnt exist');
    }
    try{
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close',()=>{
            console.log('nats connection closed!');
        });
        process.on('SIGTERM', ()=> natsWrapper.client.close());
        process.on('SIGINT', ()=> natsWrapper.client.close());
        await mongoose.connect("mongodb://order-db-mongo-srv:27017/auth");
        console.log("DB connection");
        new PaymentCompletedListener(natsWrapper.client).listen();
    }catch (err){
        console.log(err);
    }
};
app.listen(4000,() =>{
    console.log('Listening on port 4000');
});
start();