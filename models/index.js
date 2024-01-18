const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Post = require('./Post');



User.hasMany(Message, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Message.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'sender',
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
})

Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
    onDelete: 'CASCADE',
});

Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
})

User.belongsToMany(User, {
    through: Conversation,
    foreignKey: 'userOne',
    as: 'userOne'
});

User.belongsToMany(User, {
    through: Conversation,
    foreignKey: 'userTwo',
    as: 'userTwo',
})


module.exports = {
    User: User,
    Message: Message,
    Conversation: Conversation,
    Post: Post,
}