import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is reuired"],
        unique: [true, "email already exists"],
        match: [
            // eslint-disable-next-line no-useless-escape
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        match: [
            // eslint-disable-next-line no-useless-escape
            /^[a-zA-Z0-9]+$/,
            'Username can only contain letters and numbers'
        ]
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre('save', function saveUser(next) {
    const user = this;
    user.avatar = `http://robohash.org/${user.username}`;
    next();
});


const User = mongoose.model('User', userSchema);
export default User;