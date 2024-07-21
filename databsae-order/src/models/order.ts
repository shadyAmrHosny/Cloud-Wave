import mongoose from "mongoose";
import {OrderStatus, DatabaseOrderType, DatabasePlans} from "@cloud-wave/common";
export {OrderStatus, DatabaseOrderType, DatabasePlans}

interface OrderAttrs{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    databaseOrderType: DatabaseOrderType;
    price: number;
    plan: DatabasePlans
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    databaseOrderType: DatabaseOrderType;
    price: number;
    plan: DatabasePlans
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.AwaitingPayment
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    databaseOrderType: {
        type: String,
        required: true,
        enum: Object.values(DatabaseOrderType),
    },
    price: {
        type: Number,
        required: true,
    },
    plan : {
        type: String,
        required: true,
        enum: Object.values(DatabasePlans),
        default: DatabasePlans.Basic
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build =(attrs: OrderAttrs) =>{
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};