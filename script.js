document.addEventListener("DOMContentLoaded", function () {
    // PDF Merge Function
    document.getElementById("mergeButton").addEventListener("click", async function () {
        const fileInput1 = document.getElementById("mergePdfFile1");
        const fileInput2 = document.getElementById("mergePdfFile2");

        if (!fileInput1.files.length || !fileInput2.files.length) {
            alert("Please select two PDF files to merge.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf1", fileInput1.files[0]);
        formData.append("pdf2", fileInput2.files[0]);

        try {
            const response = await fetch("/merge", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to merge PDFs");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while merging PDFs.");
        }
    });

    // PDF Text Extraction Function
    document.getElementById("extractButton").addEventListener("click", async function () {
        const fileInput = document.getElementById("extractPdfFile");

        if (!fileInput.files.length) {
            alert("Please select a PDF file for text extraction.");
            return;
        }

        const formData = new FormData();
        formData.append("pdf", fileInput.files[0]);

        try {
            const response = await fetch("/extract", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to extract text.");
            }

            const text = await response.text();
            alert("Extracted Text:\n" + text);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while extracting text.");
        }
    });
});


