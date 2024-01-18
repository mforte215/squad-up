const router = require('express').Router();
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const fs = require('fs')

//#Resume Building Format
function buildResume(req) {
  return new Promise((resolve) => {
    //#USE THE BELOW, PDF CREATION WORKS
    // Create a document
    const doc = new PDFDocument({size: 'LETTER'});

    // Embed a font, set the font size, and render some text
    doc.pipe(fs.createWriteStream('./public/userResume.pdf'));

    doc
      .fontSize(35)
      .text(`${req.body.firstName} ${req.body.lastName}`, 0, 30);

    // Add an image, constrain it to a given size, and center it vertically and horizontally
    // doc.image('./Public/Image_test/Coffee-Cat.png', {
    // fit: [250, 300],
    // align: 'center',
    // valign: 'center'
    // });
    // Add another page
    doc
      .fontSize(15)
      .fillColor('blue')
      .text('GitHub Page', 10, 70, {
        link: `${req.body.github}`,
        underline: true
      }
      );
    doc
      .fontSize(25)
      .fillColor('black')
      .text('Contact Info', 10, 95, {
        underline: true
      })
    doc
      .fontSize(15)
      .fillColor('black')
      .list([
        `Phone: ${req.body.phone}`,
        `Email: ${req.body.email}`,
        `Address: ${req.body.location}`,
      ], 20, 125,)

    doc
      .fontSize(25)
      .fillColor('black')
      .text('Education', 10, 190, {
        underline: true
      })
    doc
      .fontSize(15)
      .font('Helvetica-Oblique')
      .text(`${req.body.school}`, 20, 220)

    doc
      .fontSize(25)
      .font('Helvetica')
      .fillColor('black')
      .text('Experience', 10, 255, {
        underline: true
      })
    doc
      .fontSize(15)
      .text(`${req.body.jobOne}: ${req.body.jobTime}`, 20, 285)
    doc
      .fontSize(15)
      .fillColor('black')
      .list([
        `${req.body.respoOne}`,
        `${req.body.respoTwo}`,
        `${req.body.respoThree}`,
        `${req.body.respoFour}`
      ], 20, 315,)
    // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    doc
      .scale(0.6)
      .translate(470, -380)
      .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
      .fill('red', 'even-odd')
      .restore();

    // Add some text with annotations
    doc

    // Finalize PDF file
    doc.end();
    //Create empty array to convert PDF document
    //Buffers are a representation of a sequence of bytes 
    let buffers = []
    doc.on('data', buffers.push.bind(buffers))
    //converting buffer to a Uint8Array
    doc.on('end', () => {
      let docData = new Uint8Array(Buffer.concat(buffers))
      resolve(docData)

    })
  })
}
//TODO Figure out how to make await work
// POST request     
router.post('/', async (req, res) => {
  console.log(`${req.body.firstName} ${req.body.lastName}`)
  let doc = await buildResume(req)
  let docBlob = new Blob([doc], {type: 'application/pdf'})
  console.log(docBlob)
  res.status(200).json(req.body.email)
  //From express trying to send data back to client, then need
  //JS client side to return it
  //NEED TO PROMPT DOWNLOAD FROM THE CLIENT
});


module.exports = router;



