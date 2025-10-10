export const encryptData = async (data, key) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();

    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(JSON.stringify(data))
    )

    return {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
        iv: btoa(String.fromCharCode(...iv)),
    }
}

export const decryptData = async (encryptedData, key) => {
    const cipherBytes = Uint8Array.from(atob(encryptedData.ciphertext), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));

    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherBytes
    )

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(plainBuffer));
}