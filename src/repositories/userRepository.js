import User from '../schema/users.js';
import crudRepository from './crudRepositories.js';

const userRepository = {
    ...crudRepository(User),

    getByEmail: async function (email) {
        const user = await User.findOne({ email });
        return user;
    },

    getByUsername: async function (username) {
        const user = await User.findOne({ username }).select('-password'); // exclude password
        return user;
    },
};

export default userRepository;

// export const createUser = async (user) => {
//     const newUser = await User.create(user);
//     return newUser;
// }

// export const getUsers = async () => {
//     const getAllUsers = await User.find();
//     return getAllUsers;
// }

// export const getUserById = async (id) => {
//     const user = await User.findById(id);
//     return user;
// }

// export const deleteUser = async (id) => {
//     const user = await User.findByIdAndDelete(id);
//     return user;
// }

// export const updateUser = async (id, updatedUser) => {
//     const user = await User.findByIdAndUpdate(id, updatedUser);
//     return user;
// }