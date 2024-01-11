


const onMenuToggle = () => {
    const menuElement = document.getElementById('hamburger');
    if (menuElement.checked) {
        //create and show drop down with links
        const navContainer = document.createElement('div');
        navContainer.id = ('active-nav');
        navContainer.classList.add('mobile-nav');

        //insert nav-links
        const latestArticleLink = document.createElement('a');
        latestArticleLink.href = "#latest"
        latestArticleLink.classList.add('mobile-links');
        const latestContainer = document.createElement('div');
        latestContainer.classList.add('mobile-link-container');
        const navLinkText = document.createElement('h2');
        navLinkText.classList.add('mobile-link-text')
        navLinkText.innerText = "Home";
        latestContainer.append(navLinkText);
        latestArticleLink.append(latestContainer);
        navContainer.append(latestArticleLink);


        const articleArchivesLink = document.createElement('a');
        articleArchivesLink.href = "#archive"
        articleArchivesLink.classList.add('mobile-links');
        const archieveContainer = document.createElement('div');
        archieveContainer.classList.add('mobile-link-container');
        const navArchiveLinkText = document.createElement('h2');
        navArchiveLinkText.classList.add('mobile-link-text')
        navArchiveLinkText.innerText = "Dashboard";
        archieveContainer.append(navArchiveLinkText);
        articleArchivesLink.append(archieveContainer);
        navContainer.append(articleArchivesLink);


        const searchArticlesLink = document.createElement('a');
        searchArticlesLink.href = "#search";
        searchArticlesLink.classList.add('mobile-links');
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('mobile-link-container');
        const navSearchLinkText = document.createElement('h2');
        navSearchLinkText.classList.add('mobile-link-text');
        navSearchLinkText.innerText = "Login";
        searchContainer.append(navSearchLinkText);
        searchArticlesLink.append(searchContainer);
        navContainer.append(searchArticlesLink);


        //find the navbar and append below
        const navBar = document.querySelector('.nav-bar');
        navBar.after(navContainer);
    }
    else {
        //Delete the navbar
        const activeNav = document.getElementById('active-nav');
        activeNav.remove();
    }


}

document.getElementById('hamburger').addEventListener('click', onMenuToggle);
