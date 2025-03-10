document.getElementById('mergeButton').addEventListener('click', mergePDFs);

async function mergePDFs() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (!file1 || !file2) {
        alert('Please select two PDF files to merge.');
        return;
    }

    const arrayBuffer1 = await file1.arrayBuffer();
    const arrayBuffer2 = await file2.arrayBuffer();

    const pdfDoc1 = await PDFLib.PDFDocument.load(arrayBuffer1);
    const pdfDoc2 = await PDFLib.PDFDocument.load(arrayBuffer2);

    const mergedPdf = await PDFLib.PDFDocument.create();

    // Log the number of pages in each PDF for debugging
    console.log('PDF 1 pages:', pdfDoc1.getPageCount());
    console.log('PDF 2 pages:', pdfDoc2.getPageCount());

    // Add pages from the first PDF
    for (let i = 0; i < pdfDoc1.getPageCount(); i++) {
        const [page] = await mergedPdf.copyPages(pdfDoc1, [i]);
        mergedPdf.addP



