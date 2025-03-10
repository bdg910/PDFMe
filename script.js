async function mergePDFs() {
    const input = document.getElementById("pdfInput");
    if (input.files.length < 2) {
        alert("Please select at least two PDFs to merge.");
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.create();
    
    for (const file of input.files) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        await new Promise(resolve => reader.onload = resolve);
        
        const existingPdf = await PDFLib.PDFDocument.load(reader.result);
        const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
    }

    const mergedPdfBytes = await pdfDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    const link = document.getElementById("downloadLink");
    link.href = URL.createObjectURL(blob);
    link.style.display = "block";
    link.textContent = "Download Merged PDF";
}
