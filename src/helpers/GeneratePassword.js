const generatePassword = (length, includeNumbers, includeLetters, includeSymbols, excludeLookAlike) => {
    const numbers = "0123456789";
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>/?";
    const lookAlikes = "O0Il1";

    let includedChar = '';
    if(includeNumbers) includedChar += numbers;
    if(includeLetters) includedChar += letters;
    if(includeSymbols) includedChar += symbols;
    
    if(excludeLookAlike) {
        includedChar = includedChar
        .split('')
        .filter((char) => !lookAlikes.includes(char))
        .join('');
    }

    if(!includedChar) return '';

    let password = '';

    for(let i = 0; i < length; i++){
        password += includedChar[Math.floor(Math.random() * includedChar.length)];
    }

    return password;
};

export default generatePassword;