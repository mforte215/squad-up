tinymce.init({
    selector: '#myCustomTextArea',
    plugins: [
        'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
        'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime',
        'media', 'table', 'emoticons', 'template', 'help'
    ],
    toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
        'forecolor backcolor emoticons | help',
    menu: {
        favs: {title: 'My Favorites', items: 'code visualaid | searchreplace | emoticons'}
    },
    menubar: 'favs file edit view insert format tools table help',
    content_css: "/css/post.css",
});

const submitPostHandler = async () => {
    event.preventDefault();
    //get the values out of the text boxes.
    const newPostTitle = document.getElementById('new-post-title').value.trim();
    const newPostImageUrl = document.getElementById('new-post-image-url').value.trim();
    const newPostTeaser = document.getElementById('new-post-teaser').value.trim();
    const newPostContent = tinymce.get("myCustomTextArea").getContent();

    if (newPostTitle && newPostImageUrl && newPostTeaser && newPostContent) {
        const newPost = {
            title: newPostTitle,
            image: newPostImageUrl,
            teaser: newPostTeaser,
            content: newPostContent,

        }
        console.log("LOGGING NEWLY CREATED POST");
        console.log(newPost)
        //make a POST request
        const myPostResponse = await fetch('/api/post/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: newPostTitle,
                image: newPostImageUrl,
                teaser: newPostTeaser,
                content: newPostContent,
            }),
        });

        const postData = await myPostResponse.json();

        console.log("LOGGING NEW POST RESPONSE");
        if (postData.id) {
            document.location.replace(`/post/${postData.id}`);
        }
        else {
            document.location.replace(`/`);
        }

    }


}


document.querySelector('#new-post-form').addEventListener('click', submitPostHandler)