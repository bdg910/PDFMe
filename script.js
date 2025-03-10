document.getElementById("mergeButton").addEventListener("click", async function () {
    const fileInput = document.getElementById("pdfFiles");
    const files = fileInput.files;

    if (files.length < 2) {
        alert("Please select at least two PDF files to merge.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("pdfs", files[i]);
    }

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

