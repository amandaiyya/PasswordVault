export const generateSalt = () => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return btoa(String.fromCharCode(...salt));
}

const deriveEncryptionKey = async (password, saltBase64) => {
    const enc = new TextEncoder();
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));

    const keyMeterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100_000,
            hash: "SHA-256",
        },
        keyMeterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );

    return key;
}

export default deriveEncryptionKey;