const loginHandler = async (event) => {
    event.preventDefault();

    const userEmail = document.getElementById('email').value;
    const userPW = document.getElementById('password').value;
    //make sure neither are null or whitespace
    if (userEmail.trim() && userPW.trim()) {
        //create JSON user object that represents the model
        const currentUser = {
            email: userEmail,
            password: userPW
        }
        //stringify it for the request
        const stringUser = JSON.stringify(currentUser);
        console.log(stringUser);
        const responseData = await fetch('/api/users/login', {
            method: 'POST',
            body: stringUser,
            headers: {'Content-Type': 'application/json'},
        });

        if (responseData.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/message-center')
        } else {
            alert(responseData.statusText);
        }
    }
};

document.getElementById("login-form").addEventListener('submit', loginHandler);