//Import sequelize and models
const sequelize = require('../config/connection')
const {User, Message, Conversation} = require('../models/index')
const userData = require('./userData.json');
const conversationData = require('./conversationData.json');
const messageData = require('./messageData.json');

//Seed funciton
const seedDatabase = async () => {
    //sync with database dropping exsiting tables
    await sequelize.sync({force: true});

    // Seed users and return an array of created users
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    //Seed conversations
    const conversations = await Conversation.bulkCreate(conversationData, {
        individualHooks: true,
        returning: true,
    });


    //Seed messages
    const messages = await Message.bulkCreate(messageData, {
        individualHooks: true,
        returning: true,
    });



    // exit the process 
    process.exit(0);
};

// Call the seed function
seedDatabase();
