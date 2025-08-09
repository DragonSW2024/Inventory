import CryptoJS from "crypto-js";

const secret_key = "Vaanfly-inventory"; 

function generateEncryptedQRData(item) {
    // Expiry: Midnight (next day)
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // set to 12 AM next day
    const expiryTimestamp = midnight.getTime();

    // Payload with expiry
    const payload = {
        ...item,
        expiry: expiryTimestamp
    };

    // Encrypt
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), secret_key).toString();
    return ciphertext;
}

function decryptQRData(ciphertext) {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secret_key);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        // Check expiry
        if (Date.now() > decryptedData.expiry) {
            return { error: "QR Code expired" };
        }
        return decryptedData;
    } catch (err) {
        return { error: "Invalid QR Code" };
    }
}

export { generateEncryptedQRData, decryptQRData }