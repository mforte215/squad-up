const router = require('express').Router();
const PDFDocument = require('pdfkit');
const blobStream = require('blob-stream');
const fs = require('fs')

//#Resume Building Format
function buildResume(req) {
    return new Promise((resolve) => {
        //#USE THE BELOW, PDF CREATION WORKS
        // Create a document
        const doc = new PDFDocument();

        // Embed a font, set the font size, and render some text
        doc.pipe(fs.createWriteStream('./public/userResume.pdf'));

        doc
        .fontSize(25)
        .text('Some text with an embedded font!', 100, 100);

        // Add an image, constrain it to a given size, and center it vertically and horizontally
        // doc.image('./Public/Image_test/Coffee-Cat.png', {
        // fit: [250, 300],
        // align: 'center',
        // valign: 'center'
        // });
        // Add another page
        doc
        .addPage()
        .fontSize(25)
        .text(`${req.body.firstName}`, 100, 100);

        // Apply some transforms and render an SVG path with the 'even-odd' fill rule
        doc
        .scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

        // Add some text with annotations
        doc
        .addPage()
        .fillColor('blue')
        .text('Here is a link!', 100, 100)
        .underline(100, 100, 160, 27, { color: '#0000FF' })
        .link(100, 100, 160, 27, 'http://google.com/');
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
    res.status(200).json('DoYouWork')
    //From express trying to send data back to client, then need
    //JS client side to return it
    //NEED TO PROMPT DOWNLOAD FROM THE CLIENT
  });


module.exports = router;
  


