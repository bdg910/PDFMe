async function mergePDFs() {
    const input = document.getElementById("pdfInput");
    if (input.files.length < 2) {
        alert("Please select at least two PDFs to merge.");
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.create();

    for (const file of input.files) {
        const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
        const existingPdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
        
        copiedPages.forEach(page => pdfDoc.addPage(page)); // Add pages correctly
    }

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const link = document.getElementById("downloadLink");
    link.href = URL.createObjectURL(blob);
    link.style.display = "block";
    link.textContent = "Download Merged PDF";
}


