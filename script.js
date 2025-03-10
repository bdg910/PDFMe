document.getElementById('mergeButton').addEventListener('click', mergePDFs);
document.getElementById('ocrButton').addEventListener('click', extractText);

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

    for (let i = 0; i < pdfDoc1.getPageCount(); i++) {
        const [page] = await mergedPdf.copyPages(pdfDoc1, [i]);
        mergedPdf.addPage(page);
    }

    for (let i = 0; i < pdfDoc2.getPageCount(); i++) {
        const [page] = await mergedPdf.copyPages(pdfDoc2, [i]);
        mergedPdf.addPage(page);
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.style.display = 'block';
}

async function extractText() {
    const file = document.getElementById('ocrFile').files[0];

    if (!file) {
        alert('Please select a PDF file for OCR.');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const pdfData = new Uint8Array(reader.result);

        // Convert PDF pages to images and extract text
        const text = await extractTextFromPDF(pdfData);
        
        // Display extracted text
        document.getElementById('ocrResult').textContent = text;

        // Create downloadable text file
        const textBlob = new Blob([text], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);

        const downloadTextLink = document.getElementById('downloadText');
        downloadTextLink.href = textUrl;
        downloadTextLink.download = 'extracted_text.txt';
        downloadTextLink.style.display = 'block';
    };
    reader.readAsArrayBuffer(file);
}

async function extractTextFromPDF(pdfData) {
    return new Promise((resolve) => {
        Tesseract.recognize(pdfData, 'eng', {
            logger: (m) => console.log(m) // Logs OCR progress
        }).then(({ data: { text } }) => resolve(text));
    });
}



