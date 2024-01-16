//Import sequelize and models
const sequelize = require('../config/connection')
const { User, Post, Comment, Directory } = require('../models')
const userData = require('./seeds/userData.json')
const postData = require('./seeds/postData.json')
const commentData = require('./seeds/commentData.json')

//Seed function
const seedDatabase = async () => {
    //sync with database dropping exsiting tables
    await sequelize.sync({ force: true });

    // Seed users and return an array of created users
    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    // Seed posts and return an array of created posts
    const posts = await Post.bulkCreate(postData, {
        returning: true,
    });
    // Seed comments and return an array of created comments
    const comments = await Comment.bulkCreate(commentData, {
        returning: true,
    });
     // Seed comments and return an array of created comments
    const person = await Directory.bulkCreate(userData, {
        returning: true,
    });

    // exit the process 
    process.exit(0);
};

// Call the seed function
seedDatabase();
