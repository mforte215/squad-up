const signUpPostHandler = async (event) => {
    event.preventDefault();

    const userEmail = document.getElementById('email').value;
    const userPW = document.getElementById('password').value;
    const userFirstName = document.getElementById('firstName').value;
    const userLastName = document.getElementById('lastName').value;
    const userLocation = document.getElementById('location').value;
    const userBio = document.getElementById('bio').value;
    //make sure neither are null or whitespace
    if (userEmail.trim() && userPW.trim()) {
        //create JSON user object that represents the model
        const newUser = {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            location: userLocation,
            bio: userBio,
            password: userPW
        }
        //stringify it for the request
        const stringUser = JSON.stringify(newUser);
        console.log("NEW USER");
        console.log(stringUser);
        const responseData = await fetch('/api/users/', {
            method: 'POST',
            body: stringUser,
            headers: {'Content-Type': 'application/json'},
        })

        if (responseData.ok) {
            document.location.replace('/')
        } else {
            alert(responseData);
        }
    }
}



document.getElementById("sign-up-form").addEventListener('submit', signUpPostHandler);

