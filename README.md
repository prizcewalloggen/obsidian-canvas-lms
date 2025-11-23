# Canvas LMS Integration for Obsidian

An Obsidian plugin that syncs your Canvas LMS courses with your vault, keeping your assignments, grades, and course information up to date.

## Features

-  **Smart Course Sync** - Automatically matches Canvas courses to your existing course folders
-  **Assignment Tracking** - Fetches assignments with due dates, points, and submission status
-  **Grade Monitoring** - Keeps your grades and scores updated
-  **Selective Sync** - Only syncs courses that match your existing folders
-  **Easy Setup** - Simple configuration with Canvas API token

## Installation

### From GitHub

1. Download the latest release from the [Releases page](https://github.com/yourusername/obsidian-canvas-lms/releases)
2. Extract the `canvas-lms-integration` folder to your vault's `.obsidian/plugins/` directory
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

### Manual Installation

1. Clone this repository or download the source code
2. Run `npm install` to install dependencies
3. Run `npm run build` to compile the plugin
4. Copy `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/canvas-lms-integration/` directory
5. Reload Obsidian
6. Enable the plugin in Settings → Community Plugins

## Setup

1. **Get Your Canvas API Token**
   - Log into Canvas
   - Go to Account → Settings
   - Scroll to "Approved Integrations"
   - Click "+ New Access Token"
   - Give it a name (e.g., "Obsidian Integration")
   - Copy the generated token

2. **Configure the Plugin**
   - Open Obsidian Settings → Canvas LMS Integration
   - Enter your Canvas URL (e.g., `https://northeastern.instructure.com`)
   - Paste your API token
   - Set your sync folder (default: `01-Active`)
   - Click "Test Connection" to verify

3. **Sync Your Courses**
   - Click the graduation cap icon in the ribbon, OR
   - Use Command Palette: "Sync Current Canvas Courses"

## Usage

### Commands

- **Sync Current Canvas Courses** - Full sync of courses, assignments, and grades
- **Fetch Canvas Assignments for Current Courses** - Update only assignments
- **Fetch Canvas Grades for Current Courses** - Update only grades

### What Gets Created

For each course, the plugin creates:

```
01-Active/
  └── COURSE-NAME/
      ├── Course-Overview.md       # Course info and links
      ├── Assignments-COURSE.md    # All assignments sorted by date
      └── Grades-COURSE.md         # Current grades and scores
```

### Course Matching

The plugin intelligently matches Canvas courses to your existing folders by:
- Course code (e.g., "ME3475" matches "ME3475-Fluid-Mechanics")
- Course name keywords (looks for significant matching words)

**Note:** The plugin will **only** sync courses that match existing folders in your vault. It won't create new folders for courses you're not actively tracking.

## Example Output

### Assignments

```markdown
# Assignments - Fluid Mechanics

*Last synced: 11/23/2025, 3:45 PM*

## 📅 Upcoming Assignments

### Problem Set 5
- **Due**: 11/27/2025, 11:59 PM
- **Points**: 100 points
- **Status**: ○ Not submitted
- **Link**: [View on Canvas](https://canvas.edu/courses/12345/assignments/67890)

## ✅ Past Assignments

### Midterm Exam
- **Due**: 11/15/2025, 2:00 PM
- **Points**: 200 points
- **Status**: ✓ Submitted
```

### Grades

```markdown
# Grades - Fluid Mechanics

*Last synced: 11/23/2025, 3:45 PM*

## Current Standing
- **Current Score**: 92.5%
- **Current Grade**: A-
- **Final Score**: 92.5%
- **Final Grade**: A-
```

## Configuration

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Canvas URL | Your Canvas instance URL | (empty) |
| API Token | Your Canvas API access token | (empty) |
| Sync Folder | Folder containing your course folders | `01-Active` |

## Privacy & Security

- Your API token is stored locally in Obsidian's data directory
- All API calls are made directly from your device to Canvas
- No data is sent to third-party servers
- The plugin only reads course, assignment, and grade data

## Troubleshooting

### "Failed to load" error
- Ensure all three files (`main.js`, `manifest.json`, `styles.css`) are in the plugin folder
- Try reloading Obsidian
- Check the Developer Console (Ctrl+Shift+I) for specific errors

### "Error fetching courses"
- Verify your Canvas URL is correct (include `https://`)
- Check that your API token is valid and not expired
- Ensure you have network connectivity
- Try the "Test Connection" button in settings

### No courses syncing
- Make sure you have existing course folders in your sync folder
- Check that folder names reasonably match Canvas course names/codes
- Verify courses are active in Canvas

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode with auto-rebuild
npm run dev
```

### Project Structure

```
obsidian-canvas-lms/
├── src/
│   └── main.ts          # Main plugin code
├── manifest.json        # Plugin metadata
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── .gitignore
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for [Obsidian](https://obsidian.md)
- Uses the [Canvas LMS API](https://canvas.instructure.com/doc/api/)

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/yourusername/obsidian-canvas-lms/issues)
- Check existing issues for solutions

## Changelog

### Version 1.0.0
- Initial release
- Smart course folder matching
- Assignment sync with due dates and status
- Grade tracking
- Selective sync for current courses only
