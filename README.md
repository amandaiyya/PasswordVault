# 🔐 PasswordVault

A **privacy-first password manager** built with **Next.js** and **Web Crypto API**.  
It allows users to securely generate, encrypt, store, and manage passwords locally in their browser, with end-to-end encryption powered by user-derived cryptographic keys.

---

## 🚀 Features

### 🔑 Authentication
- Secure user signup and login with hashed credentials.
- Key derivation using PBKDF2 — your password never leaves the client.
- Session-based key storage (keys disappear when the tab is closed or reloaded).

### 🧠 Vault Encryption
- All vault entries are encrypted using **AES-GCM** with unique IVs per entry.
- Each user's vault is protected by a **key derived from their login password + salt**.
- On reopening the vault, the user re-enters their password to re-derive the key — no plain keys stored anywhere.

### 🧩 Password Management
- Add, edit, or delete saved credentials easily.
- Client-side encryption/decryption ensures only the user can read their data.
- Smooth filtering and search with **debouncing** for large vaults.

### 🔒 Security Highlights
- Uses Web Crypto API for AES-GCM encryption/decryption.
- Salt-based key derivation with 100k PBKDF2 iterations.
- Encrypted “vault check” blob to verify password correctness without exposing secrets.
- Zero-knowledge architecture — the server never sees plain text passwords or vault data.

### ⚡ UX & Performance
- Instant, client-side vault search with debounce filtering.
- Modern responsive UI with clean animations.
- Auto logout and key invalidation on tab close/reload for extra safety.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend / Backend** | Next.js (App Router) |
| **Language** | JavaScript |
| **Database** | MongoDB + Mongoose |
| **Crypto** | Web Crypto API (AES-GCM, PBKDF2) |
| **State Management** | React Context API |
| **UI / Styling** | Tailwind CSS |
| **HTTP** | Axios |
| **Notifications** | React Hot Toast |

---

## 🔐 Security Flow Overview

1. **Signup**
   - User enters a password.
   - Salt is generated and stored with user record.
   - A cryptographic key is derived (`PBKDF2(password, salt)`).
   - A small encrypted blob (e.g. `"vault_check"`) is stored to verify password correctness later.

2. **Login**
   - User logs in normally.
   - A key is re-derived from their password and stored only in React context (not persisted).

3. **Vault Access**
   - On reload, vault requires password re-entry.
   - Entered password is used to re-derive key.
   - The app decrypts the “vault check” blob — if valid, vault unlocks.

4. **Encryption / Decryption**
   - Each vault item is encrypted with AES-GCM using:
     ```
     {
       ciphertext: <base64>,
       iv: <base64>
     }
     ```
   - Decryption happens entirely on the client side.

---

## 💡 Local Filtering

Vault entries are filtered **entirely client-side** with a debounced search input for smoother performance:
