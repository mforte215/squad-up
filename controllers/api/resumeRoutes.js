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
            .text('Contact Info', 10, 95)
        doc
          .fontSize(15)
          .fillColor('black')
          .list([
            `Phone: ${req.body.phone}`, 
            `Email: ${req.body.email}`,
            `Address: ${req.body.location}`,
            ], 20, 120,)
        
        doc
          .fontSize(25)
          .fillColor('black')
          .text('Education', 10, 190)
        doc
          .text(`${req.body.school}`, 230,300)
          .text(`${req.body.jobOne}`, 230,330)
          .text(`${req.body.jobTime}`, 230, 350)

        // Apply some transforms and render an SVG path with the 'even-odd' fill rule
        doc
        .scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

        // Add some text with annotations


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
    let docBlob = new Blob([doc], {type:'application/pdf'})
    console.log(docBlob)
    res.status(200).json(req.body.email)
    //From express trying to send data back to client, then need
    //JS client side to return it
    //NEED TO PROMPT DOWNLOAD FROM THE CLIENT
  });


module.exports = router;
  


