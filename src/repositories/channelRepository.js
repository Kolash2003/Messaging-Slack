import Channel from '../schema/channel.js';
import crudRepository from './crudRepositories.js';

const channelRepository = {
    ...crudRepository(Channel),
};

export default channelRepository;