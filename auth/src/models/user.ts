import mongoose from "mongoose";
import {Password} from "../service/password";
interface UserAttrs {
    name: string;
    email: string;
    password: string;
    githubId: number;
    customerId: string;
}
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// interface des that attributes that document model has
interface UserDoc extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    githubId: number;
    active: boolean;
    customerId: string;
    cardNumber:string;
}

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    githubId: {
        type: Number,
        required: false
    },
    active: {
        type: Boolean,
        default: false
    },
    customerId: {
        type: String,
        required: false
    },
    cardNumber: {
        type: String,
        required: false
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export {User};