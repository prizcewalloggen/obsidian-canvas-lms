# Publishing to GitHub - Step by Step

This guide will help you publish the Canvas LMS Integration plugin to GitHub.

## Prerequisites

- Git installed on your computer
- GitHub account
- Repository access (or create new repo)

## Step 1: Initialize Git Repository

Open a terminal in the plugin directory and run:

```bash
cd "C:\Users\pearc\OneDrive\Documents\obsidian-canvas-lms"
git init
git add .
git commit -m "Initial commit: Canvas LMS Integration plugin for Obsidian"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** button → **New repository**
3. Name it: `obsidian-canvas-lms`
4. Description: "Obsidian plugin to integrate Canvas LMS - sync courses, assignments, and grades"
5. Choose **Public** (for community plugins)
6. **Don't** initialize with README (we already have one)
7. Click **Create repository**

## Step 3: Push to GitHub

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/obsidian-canvas-lms.git
git branch -M main
git push -u origin main
```

## Step 4: Set Up for Development

### Install Dependencies

```bash
npm install
```

### Build the Plugin

```bash
npm run build
```

This creates `main.js` which is what Obsidian actually uses.

### Test Locally

Copy the built files to your vault:
```bash
# The plugin folder in your vault
cp main.js manifest.json styles.css "C:\Users\pearc\OneDrive\Obsidian\.obsidian\plugins\canvas-lms-integration\"
```

Or create a symlink for easier development (run as Administrator):
```bash
mklink /D "C:\Users\pearc\OneDrive\Obsidian\.obsidian\plugins\canvas-lms-integration" "C:\Users\pearc\OneDrive\Documents\obsidian-canvas-lms"
```

## Step 5: Create Your First Release

### Option A: Using GitHub Web Interface

1. Go to your repo → **Releases** → **Create a new release**
2. Tag version: `1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description: Copy from CHANGELOG below
5. Upload files: `main.js`, `manifest.json`, `styles.css`
6. Click **Publish release**

### Option B: Using Git Tags (Automatic with GitHub Actions)

```bash
git tag -a 1.0.0 -m "v1.0.0 - Initial Release"
git push origin 1.0.0
```

The GitHub Action will automatically build and create a draft release!

## Step 6: Update README URLs

Replace `yourusername` in README.md with your actual GitHub username:

```bash
# Find and replace in README.md
# Change: https://github.com/yourusername/obsidian-canvas-lms
# To: https://github.com/YOUR_ACTUAL_USERNAME/obsidian-canvas-lms
```

Commit the change:
```bash
git add README.md
git commit -m "Update GitHub URLs"
git push
```

## Repository Structure Explained

```
obsidian-canvas-lms/
├── .github/
│   └── workflows/
│       └── release.yml          # Automates releases when you push tags
├── .gitignore                   # Tells git what NOT to track
├── CONTRIBUTING.md              # Guide for contributors
├── LICENSE                      # MIT License
├── QUICKSTART.md               # Quick setup guide for users
├── README.md                   # Main documentation
├── esbuild.config.mjs          # Build configuration
├── main.ts                     # Source code (TypeScript)
├── manifest.json               # Plugin metadata (required by Obsidian)
├── package.json                # Node dependencies and scripts
├── styles.css                  # Plugin styles (optional)
├── tsconfig.json               # TypeScript configuration
├── version-bump.mjs            # Version management script
└── versions.json               # Version history
```

## Development Workflow

### Making Changes

1. **Edit the code** in `main.ts`
2. **Build**: `npm run build`
3. **Test** in Obsidian
4. **Commit**: 
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```

### Development Mode

Use this for auto-rebuild:
```bash
npm run dev
```

Now every time you save `main.ts`, it rebuilds automatically!

### Creating New Releases

1. Update version in `manifest.json`
2. Update `versions.json` (or run `npm run version`)
3. Commit changes
4. Create and push a tag:
   ```bash
   git tag -a 1.1.0 -m "Version 1.1.0 - New features"
   git push origin 1.1.0
   ```

## Submitting to Obsidian Community Plugins

Once your plugin is stable and tested:

1. Go to [obsidian-releases repo](https://github.com/obsidianmd/obsidian-releases)
2. Fork the repository
3. Add your plugin to `community-plugins.json`:
   ```json
   {
     "id": "canvas-lms-integration",
     "name": "Canvas LMS Integration",
     "author": "Pearce O'Connor",
     "description": "Integrate Canvas LMS with Obsidian - sync courses, assignments, and grades",
     "repo": "YOUR_USERNAME/obsidian-canvas-lms"
   }
   ```
4. Create a Pull Request
5. Wait for review (usually a few days)

## Best Practices

### Git Commit Messages
- Use clear, descriptive messages
- Start with a verb: "Add", "Fix", "Update", "Remove"
- Examples:
  - "Add assignment filtering feature"
  - "Fix grade sync bug for empty enrollments"
  - "Update README with troubleshooting tips"

### Versioning
Follow [Semantic Versioning](https://semver.org/):
- `1.0.0` → Major release (breaking changes)
- `1.1.0` → Minor release (new features)
- `1.0.1` → Patch release (bug fixes)

### Testing
Before releasing:
- Test with multiple courses
- Test with different Canvas instances if possible
- Check console for errors
- Verify all features work

## Troubleshooting Git/GitHub

### Forgot to add remote?
```bash
git remote add origin https://github.com/USERNAME/obsidian-canvas-lms.git
```

### Need to change remote URL?
```bash
git remote set-url origin https://github.com/USERNAME/obsidian-canvas-lms.git
```

### Want to see current remote?
```bash
git remote -v
```

### Build fails?
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Resources

- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Canvas API Documentation](https://canvas.instructure.com/doc/api/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Next Steps

1. **Test thoroughly** with your actual Canvas courses
2. **Gather feedback** from friends or classmates
3. **Add features** based on user needs
4. **Submit to community plugins** when ready
5. **Maintain and update** based on user feedback

Good luck with your plugin! 🚀
