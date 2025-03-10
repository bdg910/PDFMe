document.getElementById('mergeButton').addEventListener('click', mergePDFs);

async function mergePDFs() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (!file1 || !file2) {
        alert('Please select two PDF files to merge.');
        return;
    }

    try {
        // Read the PDF files as ArrayBuffer
        const arrayBuffer1 = await file1.arrayBuffer();
        const arrayBuffer2 = await file2.arrayBuffer();

        console.log("File 1 ArrayBuffer size:", arrayBuffer1.byteLength);
        console.log("File 2 ArrayBuffer size:", arrayBuffer2.byteLength);

        // Load the PDFs using pdf-lib
        const pdfDoc1 = await PDFLib.PDFDocument.load(arrayBuffer1);
        const pdfDoc2 = await PDFLib.PDFDocument.load(arrayBuffer2);

        // Create a new PDF document for the merged result
        const mergedPdf = await PDFLib.PDFDocument.create();

        // Copy pages from the first PDF (file 1)
        const pages1 = pdfDoc1.getPages();
        if (!pages1 || pages1.length === 0) {
            throw new Error('PDF 1 has no pages.');
        }
        for (const page of pages1) {
            const [copiedPage] = await mergedPdf.copyPages(pdfDoc1, [page.index]);
            mergedPdf.addPage(copiedPage);
        }

        // Copy pages from the second PDF (file 2)
        const pages2 = pdfDoc2.getPages();
        if (!pages2 || pages2.length === 0) {
            throw new Error('PDF 2 has no pages.');
        }
        for (const page of pages2) {
            const [copiedPage] = await mergedPdf.copyPages(pdfDoc2, [page.index]);
            mergedPdf.addPage(copiedPage);
        }

        // Save the merged PDF as a byte array
        const mergedPdfBytes = await mergedPdf.save();

        // Create a Blob from the merged PDF byte array
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create a download link for the merged PDF
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'merged.pdf';
        downloadLink.style.display = 'inline';  // Show the download link

    } catch (error) {
        console.error('Error merging PDFs:', error);
        alert('An error occurred while merging the PDFs. Check the console for details.');
    }
}




