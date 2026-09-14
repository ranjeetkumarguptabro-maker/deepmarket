# 💎 DeepMarket — Premium Virtual Credit Card Marketplace & Digital Asset Platform

> A state-of-the-art, glassmorphism-styled web application for purchasing premium virtual credit card suites, carding masterclasses, and encrypted digital products with instant delivery and manual LTC crypto payment verification.

---

## ⚡ Key Features

* **💳 Premium Virtual Card Suites**: Access VISA, MasterCard, and AMEX card suites with guaranteed pre-loaded balances, instant delivery, and customizable billing details.
* **⚡ Manual LTC Crypto Confirmation Gate**: Secure Litecoin (LTC) deposit flow requiring store admin verification on the blockchain before digital assets are unlocked.
* **🛡️ Multi-Layer Security Architecture**:
  * Math CAPTCHA verification widget to block automated bots.
  * Anti-bot honeypot trap fields (`website_url_honeypot_trap`) to detect headless scripts.
  * IP Rate Limiter (max 3 failed authentication attempts per 15-minute window).
  * 6-Digit Gmail OTP authentication verification modal.
* **💼 Modern Profile & Account Management**: Full customer profile editor for managing personal details, WhatsApp contact, Telegram handles, and avatar pictures.
* **🎓 Carding Masterclass Add-on**: Integrated bundle checkout for purchasing carding video courses alongside virtual card suites.

---

## 🚀 Tech Stack

* **Frontend**: React 18, Vite 5, Tailwind CSS
* **Icons & Styling**: Lucide React, Glassmorphism UI design tokens, Satoshi font
* **Backend Integration**: Express API server on port 4000, Supabase Database sync
* **Payment Gateways**: Razorpay, Instant UPI, Manual Litecoin (LTC) Blockchain Verification

---

## 🛠️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ranjeetkumarguptabro-maker/deepmarket.git
   cd deepmarket
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Frontend will run on `http://localhost:3000`*

4. **Build Production Bundle**:
   ```bash
   npx vite build
   ```

---

## 🔒 Store Admin Verification Panel

To manually verify LTC crypto payments and release digital items:
1. Open **Cart & Orders** in the application header.
2. Click **`[ Admin Gate ]`**.
3. Authorize with your admin credentials.
4. Review submitted LTC Transaction IDs on BlockCypher and click **`[ Approve & Release Items ]`**.

---

## 📜 License
Privately owned repository. All rights reserved © 2026 DeepMarket Organization.
