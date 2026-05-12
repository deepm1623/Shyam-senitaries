# 🚿 Shyam Sanitaries - Premium Sanitary Solutions

![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Interactive_UI-yellow?logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Responsive-Mobile--Friendly-0ea5e9)
![Status](https://img.shields.io/badge/Project-Production--Ready-16a34a)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A modern, premium, and business-focused frontend website for **Shyam Sanitaries**, designed to present sanitary products, brand partnerships, and customer contact channels with polished UI/UX and smooth interactions.

---

## 🌐 Live Demo

**🔗 Demo:** [shyamsanitary.in](https://shyamsanitary.in)

---

## ✨ Features

- **Premium multi-page experience** with dedicated pages for Home, Catalogue, and Contact.
- **Clean and modern visual design** using glassmorphism-inspired sections, gradients, and elegant typography.
- **Fully responsive layout** for desktop, tablet, and mobile devices.
- **Mobile-friendly navigation** with slide-in menu, body scroll lock, and ESC/outside-click close behavior.
- **Interactive UI enhancements** including reveal-on-scroll effects, smooth transitions, and animated counters.
- **Session-based preloader** for a polished first-visit experience.
- **Catalogue downloads** with category-wise product PDF links.
- **Contact conversion flow** with call, email, WhatsApp CTAs, and embedded Google Maps.
- **Frontend form handling** via `mailto:` with pre-filled subject/body.
- **Custom popup system** replacing native alerts/confirms for consistent brand UX.
- **Offline status notification** support in catalogue experience using browser online/offline events.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| UI / Icons / Fonts | Boxicons, Google Fonts (Poppins, Montserrat, Playfair Display) |
| Interactions & Animations | CSS Transitions/Keyframes, IntersectionObserver, JS Counter Animations |
| Contact & Communication | `mailto:` integration, WhatsApp deep link |
| Maps & External Embeds | Google Maps Embed |
| Backend | Not used (static frontend project) |
| Database | Not used |
| Deployment | Compatible with static hosts (Vercel, Netlify, GitHub Pages, Cloudflare Pages) |
| Local Dev Tooling | VS Code Live Server (project has Live Server settings) |

---

## ⚙️ Installation

### 1) Clone the repository
```bash
git clone <your-repository-url>
cd "Shyam Sanitary (ONLY FRONTEND)"
```

### 2) Open locally (choose one)

**Option A - Direct browser open**
- Open `index.html` in your browser.

**Option B - VS Code Live Server (recommended)**
- Install the **Live Server** extension in VS Code.
- Right-click `index.html` -> **Open with Live Server**.

### 3) Verify assets
- Ensure `images/` and `pdfs/` folders are present so logos, photos, and brochure downloads work correctly.

---

## 📁 Folder Structure

```text
Shyam Sanitary (ONLY FRONTEND)/
├── index.html            # Landing page (hero, services, counters, partners)
├── Catalogue.html        # Product catalogue with downloadable PDFs
├── contact.html          # Contact page, map, business info, mailto form
├── styles.css            # Shared styling and responsive behavior
├── custom-popup.js       # Custom branded alert/confirm popup system
├── images/               # Visual assets (logos, photos, backgrounds)
├── pdfs/                 # Product catalogue PDF files
└── .vscode/
    └── settings.json     # Editor and Live Server settings
```

---

## 🚀 Usage

1. Start from **Home** to understand the brand and offerings.  
2. Open **Catalogue** to browse product categories and download brochures.  
3. Visit **Contact** to call, email, WhatsApp, or locate the store via map.  
4. Use mobile navigation for a smooth touch-first browsing experience.  

---

## 🔮 Future Improvements

- Integrate a real backend API for form submissions (instead of `mailto:`).
- Add server-side validation, anti-spam measures, and CRM/email workflow integration.
- Refactor repeated inline scripts/styles into reusable modules for maintainability.
- Add SEO enhancements (Open Graph, Twitter cards, structured schema markup).
- Improve accessibility (ARIA refinements, focus management, reduced-motion support).
- Add CI/CD pipeline for automated deploy and quality checks.
- Introduce analytics dashboard integration for user behavior tracking.

---

## 🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/your-feature-name`  
3. Commit your changes: `git commit -m "Add: meaningful feature update"`  
4. Push the branch: `git push origin feature/your-feature-name`  
5. Open a Pull Request with clear details and screenshots (if UI changes are major)

Please keep code clean, readable, and consistent with the existing style.

---

## 📄 License

This project is licensed under the **MIT License**.  
You can add a `LICENSE` file in the root with MIT terms for official use.

---

## 👨‍💻 Author

**Deep Makwana**

- GitHub: [github.com/deepm1623](https://github.com/deepm1623)
- LinkedIn: [deep-makwana-b16a52357](https://www.linkedin.com/in/deep-makwana-b16a52357/)
- Portfolio: [deepmakwana-portfolio.vercel.app](https://deepmakwana-portfolio.vercel.app)
- Website: [deepmakwana.in](https://deepmakwana.in)

---

### 💼 Recruiter Note

This project demonstrates strong frontend fundamentals, responsive design practices, polished UI implementation, and practical business website architecture using clean static technologies.
