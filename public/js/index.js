const logoutListenerHandler = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
        document.location.replace('/login');
    } else {
        alert(response.statusText);
    }
};


const onMenuToggle = () => {
    const menuElement = document.getElementById('hamburger');
    if (menuElement.checked) {
        //create and show drop down with links
        const navContainer = document.createElement('div');
        navContainer.id = ('active-nav');
        navContainer.classList.add('mobile-nav');

        //insert nav-links
        if (document.getElementById('logout-btn')) {
            const directoryLink = document.createElement('a');
            directoryLink.href = "/directory"
            directoryLink.classList.add('mobile-links');
            const directoryContainer = document.createElement('div');
            directoryContainer.classList.add('mobile-link-container');
            const directoryLinkText = document.createElement('h2');
            directoryLinkText.classList.add('mobile-link-text')
            directoryLinkText.innerText = "Directory";
            directoryContainer.append(directoryLinkText);
            directoryLink.append(directoryContainer);
            navContainer.append(directoryLink);


            const resumeBuilderLink = document.createElement('a');
            resumeBuilderLink.href = "/resume-builder"
            resumeBuilderLink.classList.add('mobile-links');
            const resumeBuilderContainer = document.createElement('div');
            resumeBuilderContainer.classList.add('mobile-link-container');
            const resumeBuilderLinkText = document.createElement('h2');
            resumeBuilderLinkText.classList.add('mobile-link-text')
            resumeBuilderLinkText.innerText = "Resume Builder";
            resumeBuilderContainer.append(resumeBuilderLinkText);
            resumeBuilderLink.append(resumeBuilderContainer);
            navContainer.append(resumeBuilderLink);


            const messageCenterLink = document.createElement('a');
            messageCenterLink.href = "/message-center";
            messageCenterLink.classList.add('mobile-links');
            const messageCenterContainer = document.createElement('div');
            messageCenterContainer.classList.add('mobile-link-container');
            const messageCenterLinkText = document.createElement('h2');
            messageCenterLinkText.classList.add('mobile-link-text');
            messageCenterLinkText.innerText = "Message Center";
            messageCenterContainer.append(messageCenterLinkText);
            messageCenterLink.append(messageCenterContainer);
            navContainer.append(messageCenterLink);


            const accountLink = document.createElement('a');
            accountLink.href = "/account";
            accountLink.classList.add('mobile-links');
            const accountContainer = document.createElement('div');
            accountContainer.classList.add('mobile-link-container');
            const accountLinkText = document.createElement('h2');
            accountLinkText.classList.add('mobile-link-text');
            accountLinkText.innerText = "Account";
            accountContainer.append(accountLinkText);
            accountLink.append(accountContainer);
            navContainer.append(accountLink);

            const logoutLink = document.createElement('a');
            logoutLink.id = "logout-btn";
            logoutLink.addEventListener('click', logoutListenerHandler)
            logoutLink.classList.add('mobile-links');
            const logoutContainer = document.createElement('div');
            logoutContainer.classList.add('mobile-link-container');
            const logoutLinkText = document.createElement('h2');
            logoutLinkText.classList.add('mobile-link-text');
            logoutLinkText.innerText = "Logout";
            logoutContainer.append(logoutLinkText);
            logoutLink.append(logoutContainer);
            navContainer.append(logoutLink);
        }
        else {
            const loginLink = document.createElement('a');
            loginLink.href = "/login";
            loginLink.classList.add('mobile-links');
            const loginContainer = document.createElement('div');
            loginContainer.classList.add('mobile-link-container');
            const loginLinkText = document.createElement('h2');
            loginLinkText.classList.add('mobile-link-text');
            loginLinkText.innerText = "Login";
            loginContainer.append(loginLinkText);
            loginLink.append(loginContainer);
            navContainer.append(loginLink);

            const signupLink = document.createElement('a');
            signupLink.href = "/sign-up";
            signupLink.classList.add('mobile-links');
            const signupContainer = document.createElement('div');
            signupContainer.classList.add('mobile-link-container');
            const signupLinkText = document.createElement('h2');
            signupLinkText.classList.add('mobile-link-text');
            signupLinkText.innerText = "Sign up";
            signupContainer.append(signupLinkText);
            signupLink.append(signupContainer);
            navContainer.append(signupLink);
        }
        //find the navbar and append below
        const navBar = document.querySelector('.custom-nav-bar');
        navBar.after(navContainer);
    }
    else {
        //Delete the navbar
        const activeNav = document.getElementById('active-nav');
        activeNav.remove();

    }
}




const loadNewPostHandler = () => {
    event.preventDefault();
    document.location.replace('/post/new');

}







document.getElementById('hamburger').addEventListener('click', onMenuToggle);
const logoutBtn = document.getElementById('logout-btn')

const init = () => {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutListenerHandler)
    }
}

init();