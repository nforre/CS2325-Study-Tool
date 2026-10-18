# CS2325 Computer Organization Midterm Cheat Sheet & Study Suite

A print-ready 1-page US Letter exam reference sheet and interactive study tools for the CS2325 Computer Organization midterm.

---

## Why GitHub Pages Shows a Blank Screen & How It's Fixed

GitHub Pages hosts projects at a subpath URL: `https://<your-username>.github.io/<your-repo-name>/`.

By default, Vite assumes the site is hosted at the root domain (`/`), so it tries to load scripts from `https://<your-username>.github.io/assets/...` (which results in a **404 Not Found** error and causes a blank screen).

### The Fix (Already Applied)
1. **`base: './'` in `vite.config.ts`**: All CSS and JavaScript asset links are now relative, allowing the site to load properly on GitHub Pages or any subpath.
2. **Automated GitHub Actions Workflow**: A `.github/workflows/deploy.yml` file has been added.

---

## 3 Easy Ways to Run This App

### Option 1: Direct Live Link (Zero Setup)
You can view, use, and print the cheat sheet directly through the Google AI Studio hosted preview URL without needing to install anything or configure GitHub Pages.

---

### Option 2: Deploy to GitHub Pages (Automated)

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions** (instead of "Deploy from a branch").
4. Go to the **Actions** tab in GitHub. The workflow will automatically install dependencies, run `npm run build`, and deploy the production bundle in `dist/` to GitHub Pages.
5. Your cheat sheet will be live at `https://<your-username>.github.io/<repo-name>/` without a blank screen!

---

### Option 3: Run Locally on Your Computer

1. Clone or download the repository.
2. Ensure [Node.js](https://nodejs.org/) (version 18 or newer) is installed.
3. Open a terminal in the project directory and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

To create a production build locally:
```bash
npm run build
npm run preview
```

---

## Printing Instructions
- Click **"Print Sheet (1-Page Letter)"** in the top navigation or press **Ctrl+P** / **Cmd+P**.
- Paper size: **US Letter (8.5 × 11 in)**.
- Destination: **Save as PDF** or select your physical printer.
- Margins: **Default** or **Minimum** (ensure "Background graphics" is checked).
- The print stylesheet ensures the content fits on **one single page** with the reverse side blank.
