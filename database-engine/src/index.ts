import 'express-async-errors'
import mongoose from 'mongoose';
import {natsWrapper} from "./nats-wrapper";
import {DatabaseDeleteListener} from "./events/listeners/database-delete-listener";
import {PaymentCompletedListener} from "./events/listeners/payment-completed-listener";

const start = async () => {
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
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        // await mongoose.connect('mongodb://localhost:27017/auth2' );
        new PaymentCompletedListener(natsWrapper.client).listen();
        new DatabaseDeleteListener(natsWrapper.client).listen();
        console.log("DB connection");
    }catch (err){
        console.log(err);
    }
};
start();

