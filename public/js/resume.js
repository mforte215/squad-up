let h1El = document.querySelector('#form')
let firstNameEl = document.querySelector('#firstName')
let lastnameEl = document.querySelector('#lastName')
let phoneEl = document.querySelector('#phone')
let emailEl = document.querySelector('#email')
let locationEl = document.querySelector('#location')
const send = document.querySelector("#send");
let pdfButtonEl = document.querySelector('#pdfButton')

send.addEventListener('click', function(e) {
    let resumeForm = {
        firstName: firstNameEl.value.trim(),
        lastName: lastnameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        location: locationEl.value.trim()
    }
    let stringThis = JSON.stringify(resumeForm)
    let parseThise = JSON.parse(stringThis)
    fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringThis,
      })
    e.preventDefault()
})

