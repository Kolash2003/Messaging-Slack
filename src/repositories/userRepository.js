import crudRepository from "./crudRepositories"
import User from "./schema/users"

const userRepository = {
    ...crudRepository(User),
    getByEmail: async function(email) {
        const user = await User.findOne({email});
        return user;
    },

    getByUserName: async function(username) {
        const user = await User.findOne({username});
        return user;
    }
};

export default userRepository;
