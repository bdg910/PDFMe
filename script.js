document.getElementById('pdfInput').addEventListener('change', async function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function () {
            const typedarray = new Uint8Array(this.result);
            
            // Load the PDF
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1); // Get the first page
            
            // Set up canvas for rendering the page
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/png');
            
            // Process the image with Tesseract.js
            Tesseract.recognize(imgData, 'eng', {
                logger: (m) => console.log(m) // Log progress
            }).then(({ data: { text } }) => {
                document.getElementById('output').textContent = text;
            });
        };
        reader.readAsArrayBuffer(file);
    }
});


