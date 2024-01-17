const addNewMessageHandler = async (id, otherPerson) => {
    event.preventDefault();
    console.log("Clicked ADD")
    //log the value of the 
    let messageInput = document.getElementById('new-message-input').value.trim();

    if (messageInput) {
        console.log(messageInput);
        console.log("conversation id")
        console.log(id);

        const newMessage = {
            text: messageInput,
        }


        //use the API to submit a new message and then reload the load message handler
        const createMessageResponse = await fetch(`/api/messages/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: messageInput
            }),
        });


        if (createMessageResponse.ok) {
            // If successful, redirect the browser to the profile page
            loadMessagesHandler(id, otherPerson);
        } else {
            alert(createMessageResponse.statusText);
        }

    }

}

const dateConvert = (date) => {

    const d = new Date(date);

    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

}


const displayLoadedConversation = (id, otherPerson) => {

    closeModal();
    loadMessagesHandler(id, otherPerson);


}

const LoadOrCreateNewConversation = async (id, otherPerson) => {
    event.preventDefault();


    const foundConversationData = await fetch(`/conversations/checkcreate/${id}`);

    if (foundConversationData) {
        const conversationJson = await foundConversationData.json();
        console.log("LOGGING RESPONSE ON THE FRONT END");
        console.log(conversationJson);
        displayLoadedConversation(conversationJson.id, otherPerson);

    }
    else {
        console.log("Null reply");
    }
}





const loadModalUsers = async () => {

    //loading all the users except myself
    // getself from API

    const userList = await fetch('/conversations/list');

    const userListNormalized = await userList.json();

    console.log("LOGGING SELF:");
    console.log(userListNormalized);
    const UserListContainer = document.createElement('div');
    for (let i = 0; i < userListNormalized.length; i++) {


        //for each of the users build a row in the modal
        const userRow = document.createElement('div');
        userRow.classList.add('user-modal-container');
        const userDetailsDiv = document.createElement('div');
        userDetailsDiv.classList.add('user-details-div');
        const userNameDisplay = document.createElement('p');
        userNameDisplay.innerText = `${userListNormalized[i].firstName} ${userListNormalized[i].lastName}`;
        const locationDisplay = document.createElement('p');
        locationDisplay.innerText = `Location: ${userListNormalized[i].location}`;

        const userBtn = document.createElement('button');
        userBtn.classList.add('new-modal-btn');
        userBtn.classList.add('float-right');
        userBtn.textContent = "Message";
        userBtn.addEventListener('click', () => {
            LoadOrCreateNewConversation(userListNormalized[i].id, `${userListNormalized[i].firstName} ${userListNormalized[i].lastName}`);
        })



        //append to container
        userDetailsDiv.append(userNameDisplay);
        userDetailsDiv.append(locationDisplay);
        userRow.append(userDetailsDiv);
        userRow.append(userBtn);
        UserListContainer.append(userRow);
    }

    //after for loop, append the container to the modal

    const userListTitle = document.getElementById('modal-text');
    userListTitle.innerText = "Send To:"

    userListTitle.append(UserListContainer);

};


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
    newMessageForm.addEventListener('submit', () => {addNewMessageHandler(id, otherPerson)});
    newMessageForm.id = "new-message-form";
    const newMessageInput = document.createElement('input');
    newMessageInput.classList.add('new-message-input-txt');
    newMessageInput.id = "new-message-input"
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
        const messageRow = document.createElement('div');
        messageRow.classList.add('message-row');
        const messageObj = document.createElement('div');
        if (data[i].message.sender === "other") {
            messageObj.classList.add('message-tile-other');
        }
        else {
            messageObj.classList.add('message-tile-me');
        }
        messageObj.id = `conversation-${id}-message-${data[i].message.id}`;
        const messageSender = document.createElement('p');
        messageSender.innerText = data[i].message.sender;
        const messageBody = document.createElement('p');
        messageBody.classList.add('message-body-tile');
        messageBody.innerText = data[i].message.text;
        const messageData = document.createElement('p');
        messageData.innerText = "sent on " + dateConvert(data[i].message.date_sent);
        messageObj.append(messageSender);
        messageObj.append(messageBody);
        messageObj.append(messageData);
        messageRow.append(messageObj);
        messageContainer.append(messageRow);
    }
    messageDisplayContainer.append(messageContainerHeader);
    messageDisplayContainer.append(newMessageFormContainer);
    messageDisplayContainer.append(messageContainer);
    messageDisplay.append(messageDisplayContainer);

    console.log(data);
}


const openModal = () => {

    //need to open the modal and fill it with all my users.
    console.log("OPENING MODAL");
    let panel = document.createElement('div');
    panel.classList.add('modal-panel');

    let modalContent = document.createElement('div');
    modalContent.classList.add('custom-modal-content');

    let modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');

    let modalText = document.createElement('h2');
    modalText.classList.add('modal-title-text');
    modalText.id = "modal-text";
    modalText.textContent = "LOADING..";

    let modalExitBtn = document.createElement('span');
    modalExitBtn.classList.add('modal-exit-button');
    modalExitBtn.textContent = "X";
    modalExitBtn.addEventListener("click", closeModal);

    modalContainer.appendChild(modalExitBtn);
    modalContainer.appendChild(modalText);
    modalContent.appendChild(modalContainer);
    panel.appendChild(modalContent);

    let body = document.querySelector('body');
    body.append(panel);


    //load users into the modal
    loadModalUsers();
}

const closeModal = () => {
    console.log("Clicking Exit Modal");
    let foundModal = document.querySelector('.modal-panel');
    console.log(foundModal);
    if (foundModal) {
        console.log("Found A modal");
        foundModal.remove();
    }

}