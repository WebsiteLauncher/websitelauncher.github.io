# HAPPENHAUS

This site is configured to load runtime values from `config.js`, which is ignored by git.

## Local setup

1. Copy `config.example.js` to `config.js`
2. Fill in your real Firebase, Cloudinary, EmailJS, admin email, and contact values
3. Run a local server from the project folder

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/ab-events-admin.html`

## GitHub deployment

GitHub Pages is deployed through `.github/workflows/deploy.yml`.

Add these GitHub Secrets or GitHub Variables:

- `FB_API_KEY`
- `FB_AUTH_DOMAIN`
- `FB_PROJECT_ID`
- `FB_STORAGE_BUCKET`
- `FB_MESSAGING_SENDER_ID`
- `FB_APP_ID`
- `ADMIN_EMAIL_1`
- `ADMIN_EMAIL_2`
- `CLOUDINARY_CLOUD`
- `CLOUDINARY_PRESET`
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `CONTACT_WHATSAPP`
- `CONTACT_PHONE`

The workflow generates `config.js` during deploy, so credentials are not committed to the repository.

Deployment notes:

- The workflow runs on pushes to `main`, `master`, or `develop`
- It also supports manual runs from the Actions tab via `workflow_dispatch`
- Browser code cannot read GitHub repository environment variables directly
- Your Firebase and Cloudinary values only reach the site if GitHub Actions injects them into the generated `config.js`
- If you store values as GitHub Variables instead of GitHub Secrets, the workflow now supports that too

## Important note

This is a static frontend app. Any value delivered to the browser is still visible to end users in DevTools.
This setup keeps configuration out of git, but true server-only secrets must stay on a backend, not in GitHub Pages.
