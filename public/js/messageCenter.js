const addNewMessageHandler = async () => {





}



const loadMessagesHandler = async (id, otherPerson) => {
    //fetch the messages for the conversation ID.

    if (document.getElementById('message-display-container')) {

        document.getElementById('message-display-container').remove();

    }
    console.log("LOGGING FOUND MESSAGES IN LOAD MESSAGES");
    const foundMessages = await fetch(`/api/conversations/${id}`, {
        method: 'GET'
    })

    const data = await foundMessages.json();

    console.log("LOGGING MESSAGES FOR CONVERSATION: " + id);
    console.log(JSON.stringify(data));
    //set the got messages to the display to the right
    const messageDisplay = document.getElementById('message-section');
    const messageDisplayContainer = document.createElement('div');
    messageDisplayContainer.id = "message-display-container";
    const messageContainerHeader = document.createElement('h2');
    messageContainerHeader.innerText = `Messages With ${otherPerson}`;
    //create the new message form 
    const newMessageFormContainer = document.createElement('div');
    const newMessageForm = document.createElement('form');
    newMessageForm.classList.add('message-form');
    newMessageForm.id = "new-message-form";
    const newMessageInput = document.createElement('input');
    newMessageInput.classList.add('new-message-input-txt');
    newMessageInput.type = "text";
    const newButtonInput = document.createElement('input');
    newButtonInput.classList.add('new-message-btn');
    newButtonInput.type = "submit";
    newMessageForm.append(newMessageInput);
    newMessageForm.append(newButtonInput);
    newMessageFormContainer.append(newMessageForm);
    //create div container
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    for (let i = 0; i < data.length; i++) {
        const messageObj = document.createElement('div');
        messageObj.classList.add('message-tile');
        messageObj.id = `conversation-${id}-message-${data[i].message.id}`;
        const messageSender = document.createElement('p');
        messageSender.innerText = data[i].message.sender;
        const messageBody = document.createElement('p');
        messageBody.classList.add('message-body-tile');
        messageBody.innerText = data[i].message.text;
        const messageData = document.createElement('p');
        messageData.innerText = "sent at " + data[i].message.date_sent;
        messageObj.append(messageSender);
        messageObj.append(messageBody);
        messageObj.append(messageData);
        messageContainer.append(messageObj);
    }
    messageDisplayContainer.append(messageContainerHeader);
    messageDisplayContainer.append(newMessageFormContainer);
    messageDisplayContainer.append(messageContainer);
    messageDisplay.append(messageDisplayContainer);

    console.log(data);
}