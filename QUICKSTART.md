# Quick Start Guide

Get up and running with Canvas LMS Integration in 5 minutes!

## Step 1: Install the Plugin

### Option A: From GitHub (Recommended for now)
1. Download the latest release from [Releases](https://github.com/yourusername/obsidian-canvas-lms/releases)
2. Extract the files
3. Copy `main.js`, `manifest.json`, and `styles.css` to:
   ```
   YOUR_VAULT/.obsidian/plugins/canvas-lms-integration/
   ```
4. Restart Obsidian
5. Enable the plugin in Settings → Community Plugins

### Option B: Build from Source
```bash
git clone https://github.com/yourusername/obsidian-canvas-lms.git
cd obsidian-canvas-lms
npm install
npm run build
# Copy main.js, manifest.json, and styles.css to your vault
```

## Step 2: Get Your Canvas API Token

1. Log into your Canvas instance
2. Click your profile picture → **Settings**
3. Scroll down to **Approved Integrations**
4. Click **+ New Access Token**
5. Enter purpose: `Obsidian Integration`
6. Set expiry date (optional, but recommended for security)
7. Click **Generate Token**
8. **Copy the token immediately** (you won't see it again!)

## Step 3: Configure the Plugin

1. Open Obsidian Settings
2. Go to **Canvas LMS Integration**
3. Enter your **Canvas URL**
   - Example: `https://northeastern.instructure.com`
   - Example: `https://canvas.schoolname.edu`
   - Don't include `/courses/` or anything after the domain
4. Paste your **API Token**
5. Set your **Sync Folder** (default: `01-Active`)
6. Click **Test Connection** to verify

## Step 4: Prepare Your Vault

Make sure you have folders for your current courses:

```
01-Active/
├── ME3475-Fluid-Mechanics/
├── ME2355-Mechanics-of-Materials/
├── ENCP3000-Professional-Issues/
└── ... (other courses)
```

The plugin will match these folder names to your Canvas courses automatically.

## Step 5: Sync!

Click the 🎓 graduation cap icon in the ribbon, OR use Command Palette:
- `Ctrl/Cmd + P` → "Sync Current Canvas Courses"

The plugin will:
1. Scan your course folders
2. Match them to Canvas courses
3. Create/update these files in each folder:
   - `Course-Overview.md` - Course details and links
   - `Assignments-[COURSE].md` - All assignments
   - `Grades-[COURSE].md` - Your current grades

## What You'll See

### Course Overview Example
```markdown
# Fluid Mechanics

**Course Code**: ME3475
**Canvas ID**: 123456
**Start Date**: 1/13/2025
**End Date**: 4/24/2025

## Quick Links
- [Canvas Course Page](https://canvas.edu/courses/123456)
- [[Assignments-ME3475-Fluid-Mechanics|Assignments]]
- [[Grades-ME3475-Fluid-Mechanics|Grades]]
```

### Assignments Example
```markdown
## 📅 Upcoming Assignments

### Problem Set 5
- **Due**: 11/27/2025, 11:59 PM
- **Points**: 100 points
- **Status**: ○ Not submitted
- **Link**: [View on Canvas](...)
```

### Grades Example
```markdown
## Current Standing
- **Current Score**: 92.5%
- **Current Grade**: A-
```

## Usage Tips

### Keeping Things Updated

Run sync regularly to get the latest assignments and grades:
- Click the 🎓 icon
- Or use Command Palette → "Sync Current Canvas Courses"

### Selective Updates

If you only need assignments or grades:
- "Fetch Canvas Assignments for Current Courses"
- "Fetch Canvas Grades for Current Courses"

### Folder Matching

The plugin matches folders to courses by:
- **Course codes**: "ME3475" in folder name
- **Course names**: Keywords from the course title

Examples that match:
- `ME3475-Fluid-Mechanics` ✓
- `ME3475` ✓
- `Fluid-Mechanics-Fall2025` ✓
- `Mechanics-Fluids` ✓ (if enough keywords match)

### Organizing Your Notes

The plugin creates index files, but you can organize however you want:

```
ME3475-Fluid-Mechanics/
├── Course-Overview.md (created by plugin)
├── Assignments-ME3475-Fluid-Mechanics.md (created by plugin)
├── Grades-ME3475-Fluid-Mechanics.md (created by plugin)
├── Notes/
│   ├── Week-1-Notes.md
│   ├── Week-2-Notes.md
│   └── ...
├── Homework/
│   ├── HW1.md
│   └── HW2.md
└── Exams/
    └── Midterm-Study-Guide.md
```

## Troubleshooting

### "Failed to load"
- Make sure all three files are in the plugin folder
- Try reloading Obsidian
- Check console (Ctrl+Shift+I) for errors

### "Error fetching courses"
- Verify Canvas URL is correct (include `https://`)
- Check API token hasn't expired
- Click "Test Connection" in settings

### No courses syncing
- Make sure course folders exist in your sync folder
- Folder names should reasonably match Canvas course names
- Check that courses are active in Canvas

### Permission errors
- Ensure your API token has proper permissions
- Some Canvas instances restrict API access - check with your IT

## Next Steps

- Set up [[templates]] for assignments and notes
- Create [[MOCs]] (Maps of Content) to organize course materials
- Link assignments to your notes with `[[]]`
- Use tags like `#assignment` or `#exam` for filtering

## Need Help?

- Check the [full README](README.md)
- Open an [issue on GitHub](https://github.com/yourusername/obsidian-canvas-lms/issues)
- See [Contributing Guide](CONTRIBUTING.md) to add features

Happy studying! 📚
