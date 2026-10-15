
const qrform = document.getElementById("qrform");
const qrtext = document.getElementById("qrtext");
const qrimg = document.getElementById("qrimg");
const result = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");

let qrUrl = "";

qrform.addEventListener("submit", function (event) {
    event.preventDefault();
    generateQr();
});

function generateQr() {
    const text = qrtext.value.trim();

    if (!text) {
        status.textContent = "Please enter some text or a URL.";
        result.hidden = true;
        qrtext.focus();
        return;
    }

    status.textContent = "Generating your QR code...";
    result.hidden = true;
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/" +
        "?size=200x200&format=png&data=" +
        encodeURIComponent(text);

    // Wait for the image to load before showing the result.
    qrimg.onload = function () {
        result.hidden = false;
        status.textContent = "";
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate";
    };

    qrimg.onerror = function () {
        result.hidden = true;
        status.textContent =
            "Unable to generate the QR code. Check your internet connection and try again.";
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate";
        qrUrl = "";
    };

    qrimg.src = qrUrl;
}

downloadBtn.addEventListener("click", async function () {
    if (!qrUrl) {
        status.textContent = "Generate a QR code first.";
        return;
    }

    downloadBtn.disabled = true;
    downloadBtn.textContent = "Downloading...";
    status.textContent = "";

    try {
        const response = await fetch(qrUrl);

        if (!response.ok) {
            throw new Error("QR image download failed.");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = objectUrl;
        link.download = "qr-code.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(objectUrl);
        status.textContent = "QR code download started.";
    } catch (error) {
        status.textContent =
            "Download failed. Try right-clicking the QR code and saving the image.";
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download QR Code";
    }
});
