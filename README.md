# CuriosityInc — Personal Branding Website & Markdown CMS

A high-performance personal branding website, market intelligence portal, and showcase platform for **CuriosityInc**. Powered by **React (Vite)**, **Tailwind CSS**, and a **100% Zero-Code Local Markdown Content System**.

---

## ✨ Key Features

- ⚡ **Ultra-Fast React + Vite Architecture**: Sub-second page loads and instantaneous interactive filtering.
- 🎨 **Sleek Aesthetic Design System**: Deep Obsidian dark theme with amber & brand glows, paired with a crisp light theme toggle.
- 📝 **Zero-Code Markdown CMS**: Add, edit, or remove blog posts and portfolio case studies simply by adding `.md` files to `/src/content/blogs/` and `/src/content/portfolio/`.
- 🛠️ **Built-in Visual Content Studio**: An integrated web interface to create, preview, and download `.md` files with frontmatter.
- 💻 **Interactive Terminal CLI Wizard**: Run `npm run cms` to create new articles via guided terminal prompts.
- 📖 **Distraction-Free Modal Reader**: Full-screen article & project reader with reading progress bar, share actions, and bookmarking.
- 📬 **Interactive Contact Form**: Client-side validation, confetti animations, and native mailto fallback.
- 🚀 **1-Click Free Deployment**: Pre-configured with `vercel.json` and `netlify.toml`.

---

## 📁 Folder Structure

```
curiosity-inc/
├── src/
│   ├── components/            # UI Components
│   │   ├── Navbar.jsx         # Sticky header with theme toggle & CMS button
│   │   ├── HeroSection.jsx    # Hero headline, metric counters, & CTAs
│   │   ├── AboutSection.jsx   # Bio, 3 core pillars, & milestone track
│   │   ├── BlogSection.jsx    # Market views feed with search & category filters
│   │   ├── PortfolioSection.jsx # Project showcase with metric badges & case studies
│   │   ├── ContactSection.jsx # Client-side form with confetti & email links
│   │   ├── ContentModalReader.jsx # Full-screen article reader with progress bar
│   │   ├── ContentStudioModal.jsx # Built-in visual Markdown editor & exporter
│   │   └── Footer.jsx         # Newsletter subscription & quick links
│   ├── content/               # 🎯 YOUR CONTENT GOES HERE (Plain Markdown)
│   │   ├── blogs/             # Markdown files for Market Views / Articles
│   │   ├── portfolio/         # Markdown files for Case Studies / Projects
│   │   └── templates/         # Ready-to-copy Markdown templates
│   ├── utils/
│   │   └── contentLoader.js   # Dynamic loader and YAML frontmatter parser
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── cms.js                 # Interactive Terminal CLI assistant
├── vercel.json                # Vercel deployment configuration
├── netlify.toml               # Netlify deployment configuration
└── package.json
```

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 How to Manage Articles (Non-Technical Guide)

You have **3 easy ways** to add or edit articles without touching any React code:

### Method A: The Built-in Web Content Studio (Recommended)
1. Open your website in the browser.
2. Click the **"Content Studio"** button in the top navigation or hero section.
3. Fill in your Title, Category, Tags, and Article text.
4. Click **"Download File"** and place the downloaded `.md` file into `src/content/blogs/` (or `src/content/portfolio/`).
5. Your website automatically updates with the new article!

### Method B: The Terminal CLI Wizard
Open your terminal in the project directory and run:
```bash
npm run cms
```
The wizard will ask you simple questions (Title, Category, Tags, Summary) and automatically generate the `.md` file for you.

### Method C: Plain Text Editing
1. Open `src/content/templates/blog-template.md` (or `portfolio-template.md`).
2. Copy it into `src/content/blogs/my-new-post.md`.
3. Edit the title and body in any text editor (Notepad, VS Code, etc.).

---

## 🌐 1-Click Free Deployment Guide

### Deploying to Vercel (Free)
1. Push your repository to [GitHub](https://github.com).
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Vercel will automatically detect the Vite build settings. Click **"Deploy"**.
5. Your site is live on a custom `*.vercel.app` domain with automatic SSL!

### Deploying to Netlify (Free)
1. Go to [Netlify.com](https://netlify.com) and click **"Add new site" > "Import an existing project"**.
2. Connect your GitHub repository.
3. The build command (`npm run build`) and publish directory (`dist`) are automatically detected from `netlify.toml`.
4. Click **"Deploy site"**!

---

© 2026 CuriosityInc. All Rights Reserved.
