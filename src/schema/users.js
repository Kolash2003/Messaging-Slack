import bcrypt from "bcrypt";
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

// this prehook is being used to hash the password before saving it to the database (user Auth)
userSchema.pre('save', function saveUser() {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = hashedPassword;
    user.avatar = `http://robohash.org/${user.username}`;
});

const User = mongoose.model('User', userSchema);
export default User;