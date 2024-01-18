let h1El = document.querySelector('#form')
let firstNameEl = document.querySelector('#firstName')
let lastnameEl = document.querySelector('#lastName')
let phoneEl = document.querySelector('#phone')
let emailEl = document.querySelector('#email')
let locationEl = document.querySelector('#location')
let githubEl = document.querySelector('#github')
let schoolEl = document.querySelector('#schoolOne')
let jobOneEl = document.querySelector('#jobOne')
let timeEl = document.querySelector('#atJob')
let respoOneEl = document.querySelector('#respoOne')
let respoTwoEl = document.querySelector('#respoTwo')
let respoThreeEl = document.querySelector('#respoThree')
let respoFourEl = document.querySelector('#respoFour')
const send = document.querySelector("#send");
let pdfButtonEl = document.querySelector('#pdfButton')

send.addEventListener('click', async function(e) {
  e.preventDefault()
    let resumeForm = {
        firstName: firstNameEl.value.trim(),
        lastName: lastnameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        location: locationEl.value.trim(),
        github: githubEl.value.trim(),
        school: schoolEl.value.trim(),
        jobOne: jobOneEl.value.trim(),
        jobTime: timeEl.value.trim(),
        respoOne: respoOneEl.value.trim(),
        respoTwo: respoTwoEl.value.trim(),
        respoThree: respoThreeEl.value.trim(),
        respoFour: respoFourEl.value.trim(),
    }
    let stringThis = JSON.stringify(resumeForm)
    console.log(resumeForm.email)
    let parseThise = JSON.parse(stringThis)
    const buildIt = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: stringThis,
      })
    const buildObject = await buildIt.json()
    console.log(buildObject)
  
    pdfButton()
  })

function pdfButton() {
  // create a new button
  const newDiv = document.createElement("a");
  // and give it some content
  newDiv.textContent ="Get My PDF"

  newDiv.setAttribute('class', 'border')
  newDiv.setAttribute('href', '/userResume.pdf')
  

  pdfButtonEl.appendChild(newDiv);
}

