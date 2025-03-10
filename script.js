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

    const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
    pages1.forEach(page => mergedPdf.addPage(page));

    const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
    pages2.forEach(page => mergedPdf.addPage(page));

    const mergedPdfBytes = await mergedPdf.save();

    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.style.display = 'block';
}

