document.getElementById('mergeButton').addEventListener('click', mergePDFs);
document.getElementById('splitButton').addEventListener('click', splitPDF);
document.getElementById('watermarkButton').addEventListener('click', addWatermark);
document.getElementById('compressButton').addEventListener('click', compressPDF);
document.getElementById('pageNumberButton').addEventListener('click', addPageNumbers);
document.getElementById('rotateButton').addEventListener('click', rotatePDF);

async function mergePDFs() {
    const file1 = document.getElementById('mergeFile1').files[0];
    const file2 = document.getElementById('mergeFile2').files[0];

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
    downloadPDF(mergedPdfBytes, 'merged.pdf');
}

async function splitPDF() {
    const file = document.getElementById('splitFile').files[0];
    const pageNumber = parseInt(document.getElementById('splitPage').value);

    if (!file || isNaN(pageNumber)) {
        alert('Please select a PDF file and enter a valid page number.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    if (pageNumber < 1 || pageNumber > pdfDoc.getPageCount()) {
        alert('Invalid page number.');
        return;
    }

    const splitPdf = await PDFLib.PDFDocument.create();
    const [page] = await splitPdf.copyPages(pdfDoc, [pageNumber - 1]);
    splitPdf.addPage(page);

    const splitPdfBytes = await splitPdf.save();
    downloadPDF(splitPdfBytes, `split-page-${pageNumber}.pdf`);
}

async function addWatermark() {
    const file = document.getElementById('watermarkFile').files[0];
    const watermarkText = document.getElementById('watermarkText').value;

    if (!file || !watermarkText) {
        alert('Please select a PDF file and enter watermark text.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
            x: width / 2 - 50,
            y: height / 2,
            size: 30,
            color: PDFLib.rgb(0.5, 0.5, 0.5),
            opacity: 0.5,
        });
    });

    const watermarkedPdfBytes = await pdfDoc.save();
    downloadPDF(watermarkedPdfBytes, 'watermarked.pdf');
}

async function compressPDF() {
    const file = document.getElementById('compressFile').files[0];
    if (!file) {
        alert('Please select a PDF file.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    // Basic compression by reducing image quality
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const images = page.getImages();
        for (const image of images) {
            image.setQuality(50); // Reduce image quality
        }
    }

    const compressedPdfBytes = await pdfDoc.save();
    downloadPDF(compressedPdfBytes, 'compressed.pdf');
}

async function addPageNumbers() {
    const file = document.getElementById('pageNumberFile').files[0];
    if (!file) {
        alert('Please select a PDF file.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        page.drawText(`Page ${index + 1}`, {
            x: width - 50,
            y: 20,
            size: 12,
            color: PDFLib.rgb(0, 0, 0),
        });
    });

    const numberedPdfBytes = await pdfDoc.save();
    downloadPDF(numberedPdfBytes, 'numbered.pdf');
}

async function rotatePDF() {
    const file = document.getElementById('rotateFile').files[0];
    const angle = parseInt(document.getElementById('rotateAngle').value);

    if (!file || isNaN(angle)) {
        alert('Please select a PDF file and choose a rotation angle.');
        return;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

    const pages = pdfDoc.getPages();
    pages.forEach(page => page.setRotation(angle));

    const rotatedPdfBytes = await pdfDoc.save();
    downloadPDF(rotatedPdfBytes, 'rotated.pdf');
}

function downloadPDF(pdfBytes, fileName) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.style.display = 'block';
}


