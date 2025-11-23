# Contributing to Canvas LMS Integration

Thank you for your interest in contributing! Here's how you can help:

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/obsidian-canvas-lms.git
   cd obsidian-canvas-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```

4. **Link to your vault for testing**
   ```bash
   # Create a symlink from the repo to your vault's plugins folder
   # On Windows (run as Administrator):
   mklink /D "C:\path\to\vault\.obsidian\plugins\canvas-lms-integration" "C:\path\to\repo"
   
   # On Mac/Linux:
   ln -s /path/to/repo /path/to/vault/.obsidian/plugins/canvas-lms-integration
   ```

## Project Structure

```
obsidian-canvas-lms/
├── main.ts              # Main plugin code (TypeScript)
├── manifest.json        # Plugin metadata
├── package.json         # Node dependencies
├── tsconfig.json        # TypeScript configuration
├── esbuild.config.mjs   # Build configuration
├── styles.css           # Plugin styles
└── README.md           # Documentation
```

## Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit `main.ts` for functionality changes
   - Edit `styles.css` for styling changes
   - Update `README.md` if adding new features

3. **Test your changes**
   - Reload Obsidian to see your changes
   - Test with a real Canvas instance
   - Check console for errors

4. **Build and verify**
   ```bash
   npm run build
   ```

## Code Guidelines

- **TypeScript**: Use proper types, avoid `any` when possible
- **Error Handling**: Always wrap API calls in try-catch
- **User Feedback**: Use `Notice` for user-facing messages
- **Console Logging**: Use `console.log` for debugging, `console.error` for errors
- **Formatting**: Keep code clean and readable

## Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** with different Canvas setups
3. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: describe what you added"
   ```

4. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub
   - Describe what changed and why
   - Reference any related issues
   - Add screenshots if applicable

## Feature Ideas

Here are some features that would be great additions:

- [ ] Assignment reminders/notifications
- [ ] Sync discussion posts
- [ ] Download course files
- [ ] Calendar integration
- [ ] Submission tracking
- [ ] Grade analytics/charts
- [ ] Custom assignment templates
- [ ] Module/unit tracking
- [ ] Quiz integration
- [ ] Bulk operations

## Reporting Bugs

If you find a bug:

1. **Check existing issues** to see if it's already reported
2. **Create a new issue** with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Console error messages (if any)
   - Obsidian version
   - Plugin version

## Questions?

Feel free to open an issue for questions or discussion!

## Code of Conduct

Be respectful and constructive. We're all here to learn and build something useful together.
