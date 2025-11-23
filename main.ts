import { Plugin, Notice, PluginSettingTab, Setting, requestUrl, TFolder } from 'obsidian';

interface CanvasLMSSettings {
	canvasUrl: string;
	apiToken: string;
	syncFolder: string;
	courseMapping: Record<string, string>;
}

const DEFAULT_SETTINGS: CanvasLMSSettings = {
	canvasUrl: '',
	apiToken: '',
	syncFolder: '01-Active',
	courseMapping: {}
};

interface CourseFolder {
	path: string;
	name: string;
}

interface CanvasCourse {
	id: number;
	name: string;
	course_code: string;
	enrollment_term_id?: number;
	start_at?: string;
	end_at?: string;
	public_description?: string;
}

interface CanvasAssignment {
	id: number;
	name: string;
	description?: string;
	due_at?: string;
	points_possible?: number;
	has_submitted_submissions?: boolean;
	html_url: string;
}

interface CanvasGrades {
	current_score?: number;
	final_score?: number;
	current_grade?: string;
	final_grade?: string;
}

interface CanvasEnrollment {
	grades?: CanvasGrades;
}

export default class CanvasLMSPlugin extends Plugin {
	settings: CanvasLMSSettings;

	async onload() {
		console.log('Loading Canvas LMS Integration plugin');

		await this.loadSettings();
		this.addSettingTab(new CanvasLMSSettingTab(this.app, this));

		this.addRibbonIcon('graduation-cap', 'Sync Canvas', async () => {
			await this.syncCurrentCourses();
		});

		this.addCommand({
			id: 'sync-canvas-current-courses',
			name: 'Sync Current Canvas Courses',
			callback: async () => {
				await this.syncCurrentCourses();
			}
		});

		this.addCommand({
			id: 'fetch-canvas-assignments',
			name: 'Fetch Canvas Assignments for Current Courses',
			callback: async () => {
				await this.fetchAssignmentsForCurrentCourses();
			}
		});

		this.addCommand({
			id: 'fetch-canvas-grades',
			name: 'Fetch Canvas Grades for Current Courses',
			callback: async () => {
				await this.fetchGradesForCurrentCourses();
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async validateConnection(): Promise<boolean> {
		if (!this.settings.canvasUrl || !this.settings.apiToken) {
			new Notice('Please configure Canvas URL and API token in settings');
			return false;
		}
		return true;
	}

	async getCurrentCourseFolders(): Promise<CourseFolder[]> {
		const syncPath = this.settings.syncFolder;
		
		try {
			const folderExists = await this.app.vault.adapter.exists(syncPath);
			if (!folderExists) {
				new Notice(`Sync folder "${syncPath}" does not exist`);
				return [];
			}

			const items = await this.app.vault.adapter.list(syncPath);
			const courseFolders: CourseFolder[] = [];

			for (const folder of items.folders) {
				const folderName = folder.split('/').pop();
				if (folderName && !folderName.startsWith('.') && folderName !== 'Attachments') {
					courseFolders.push({
						path: folder,
						name: folderName
					});
				}
			}

			return courseFolders;
		} catch (error) {
			console.error('Error getting course folders:', error);
			return [];
		}
	}

	async fetchCourses(): Promise<CanvasCourse[] | null> {
		if (!await this.validateConnection()) return null;

		try {
			const response = await requestUrl({
				url: `${this.settings.canvasUrl}/api/v1/courses?enrollment_state=active&per_page=100`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.settings.apiToken}`
				}
			});

			return response.json as CanvasCourse[];
		} catch (error) {
			new Notice('Error fetching courses from Canvas: ' + (error as Error).message);
			console.error('Canvas API error:', error);
			return null;
		}
	}

	matchCourseToFolder(course: CanvasCourse, folderName: string): boolean {
		const courseName = course.name.toLowerCase();
		const courseCode = (course.course_code || '').toLowerCase();
		const folder = folderName.toLowerCase();

		if (folder.includes(courseCode)) return true;
		
		const courseWords = courseName.split(/[\s-]+/);
		const folderWords = folder.split(/[\s-]+/);
		
		let matchCount = 0;
		for (const word of courseWords) {
			if (word.length > 3 && folderWords.some(fw => fw.includes(word) || word.includes(fw))) {
				matchCount++;
			}
		}
		
		return matchCount >= 2;
	}

	async syncCurrentCourses() {
		new Notice('Syncing current Canvas courses...');

		const courseFolders = await this.getCurrentCourseFolders();
		if (courseFolders.length === 0) {
			new Notice('No course folders found in ' + this.settings.syncFolder);
			return;
		}

		const canvasCourses = await this.fetchCourses();
		if (!canvasCourses) return;

		let syncedCount = 0;

		for (const folder of courseFolders) {
			const matchedCourse = canvasCourses.find(course => 
				this.matchCourseToFolder(course, folder.name)
			);

			if (matchedCourse) {
				await this.syncCourse(matchedCourse, folder.path, folder.name);
				syncedCount++;
			} else {
				console.log(`No Canvas course found for folder: ${folder.name}`);
			}
		}

		if (syncedCount > 0) {
			new Notice(`✓ Synced ${syncedCount} course(s) successfully!`);
		} else {
			new Notice('No matching Canvas courses found for your current folders');
		}
	}

	async syncCourse(course: CanvasCourse, folderPath: string, folderName: string) {
		const overviewPath = `${folderPath}/Course-Overview.md`;
		const overviewContent = this.generateCourseOverview(course, folderName);
		
		try {
			if (await this.app.vault.adapter.exists(overviewPath)) {
				const file = this.app.vault.getAbstractFileByPath(overviewPath);
				if (file) {
					await this.app.vault.modify(file, overviewContent);
				}
			} else {
				await this.app.vault.create(overviewPath, overviewContent);
			}
		} catch (error) {
			console.error('Error creating overview:', error);
		}

		const assignments = await this.fetchCourseAssignments(course.id);
		if (assignments) {
			await this.saveAssignments(folderPath, assignments, course, folderName);
		}

		const grades = await this.fetchCourseGrades(course.id);
		if (grades && grades.length > 0) {
			await this.saveGrades(folderPath, course, grades[0], folderName);
		}
	}

	async fetchCourseAssignments(courseId: number): Promise<CanvasAssignment[] | null> {
		if (!await this.validateConnection()) return null;

		try {
			const response = await requestUrl({
				url: `${this.settings.canvasUrl}/api/v1/courses/${courseId}/assignments?per_page=100`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.settings.apiToken}`
				}
			});

			return response.json as CanvasAssignment[];
		} catch (error) {
			new Notice(`Error fetching assignments: ${(error as Error).message}`);
			console.error('Canvas API error:', error);
			return null;
		}
	}

	async fetchCourseGrades(courseId: number): Promise<CanvasEnrollment[] | null> {
		if (!await this.validateConnection()) return null;

		try {
			const response = await requestUrl({
				url: `${this.settings.canvasUrl}/api/v1/courses/${courseId}/enrollments?user_id=self&include[]=total_scores`,
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${this.settings.apiToken}`
				}
			});

			return response.json as CanvasEnrollment[];
		} catch (error) {
			new Notice(`Error fetching grades: ${(error as Error).message}`);
			console.error('Canvas API error:', error);
			return null;
		}
	}

	generateCourseOverview(course: CanvasCourse, folderName: string): string {
		const startDate = course.start_at ? new Date(course.start_at).toLocaleDateString() : 'N/A';
		const endDate = course.end_at ? new Date(course.end_at).toLocaleDateString() : 'N/A';
		
		return `# ${course.name}

**Course Code**: ${course.course_code}
**Canvas ID**: ${course.id}
**Term**: ${course.enrollment_term_id || 'N/A'}
**Start Date**: ${startDate}
**End Date**: ${endDate}

## Quick Links
- [Canvas Course Page](${this.settings.canvasUrl}/courses/${course.id})
- [[Assignments-${folderName}|Assignments]]
- [[Grades-${folderName}|Grades]]

## Course Description
${course.public_description || 'No description available'}

## Notes
`;
	}

	async saveAssignments(folderPath: string, assignments: CanvasAssignment[], course: CanvasCourse, folderName: string) {
		const assignmentsPath = `${folderPath}/Assignments-${folderName}.md`;
		
		let content = `# Assignments - ${course.name}\n\n`;
		content += `*Last synced: ${new Date().toLocaleString()}*\n\n`;

		const sortedAssignments = assignments.sort((a, b) => {
			if (!a.due_at) return 1;
			if (!b.due_at) return -1;
			return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
		});

		const now = new Date();
		const upcoming = sortedAssignments.filter(a => a.due_at && new Date(a.due_at) > now);
		const past = sortedAssignments.filter(a => a.due_at && new Date(a.due_at) <= now);
		const noDueDate = sortedAssignments.filter(a => !a.due_at);

		if (upcoming.length > 0) {
			content += `## 📅 Upcoming Assignments\n\n`;
			for (const assignment of upcoming) {
				content += this.formatAssignment(assignment);
			}
		}

		if (past.length > 0) {
			content += `## ✅ Past Assignments\n\n`;
			for (const assignment of past) {
				content += this.formatAssignment(assignment);
			}
		}

		if (noDueDate.length > 0) {
			content += `## 📝 No Due Date\n\n`;
			for (const assignment of noDueDate) {
				content += this.formatAssignment(assignment);
			}
		}

		try {
			if (await this.app.vault.adapter.exists(assignmentsPath)) {
				const file = this.app.vault.getAbstractFileByPath(assignmentsPath);
				if (file) {
					await this.app.vault.modify(file, content);
				}
			} else {
				await this.app.vault.create(assignmentsPath, content);
			}
		} catch (error) {
			console.error('Error saving assignments:', error);
		}
	}

	formatAssignment(assignment: CanvasAssignment): string {
		const dueDate = assignment.due_at ? new Date(assignment.due_at).toLocaleString() : 'No due date';
		const points = assignment.points_possible ? `${assignment.points_possible} points` : 'Ungraded';
		const submitted = assignment.has_submitted_submissions ? '✓ Submitted' : '○ Not submitted';
		
		let desc = '';
		if (assignment.description) {
			const tempDesc = assignment.description.replace(/<[^>]*>/g, '').substring(0, 200);
			desc = tempDesc.length < assignment.description.length ? tempDesc + '...' : tempDesc;
		}
		
		return `### ${assignment.name}
- **Due**: ${dueDate}
- **Points**: ${points}
- **Status**: ${submitted}
- **Link**: [View on Canvas](${assignment.html_url})

${desc ? `**Description:** ${desc}\n` : ''}
---

`;
	}

	async saveGrades(folderPath: string, course: CanvasCourse, enrollment: CanvasEnrollment, folderName: string) {
		const gradesPath = `${folderPath}/Grades-${folderName}.md`;
		
		const currentScore = enrollment.grades?.current_score || 'N/A';
		const finalScore = enrollment.grades?.final_score || 'N/A';
		const currentGrade = enrollment.grades?.current_grade || 'N/A';
		const finalGrade = enrollment.grades?.final_grade || 'N/A';

		const content = `# Grades - ${course.name}

*Last synced: ${new Date().toLocaleString()}*

## Current Standing
- **Current Score**: ${typeof currentScore === 'number' ? currentScore + '%' : currentScore}
- **Current Grade**: ${currentGrade}
- **Final Score**: ${typeof finalScore === 'number' ? finalScore + '%' : finalScore}
- **Final Grade**: ${finalGrade}

## Links
- [View Grades on Canvas](${this.settings.canvasUrl}/courses/${course.id}/grades)

---

*Grades are synced from Canvas LMS*
`;

		try {
			if (await this.app.vault.adapter.exists(gradesPath)) {
				const file = this.app.vault.getAbstractFileByPath(gradesPath);
				if (file) {
					await this.app.vault.modify(file, content);
				}
			} else {
				await this.app.vault.create(gradesPath, content);
			}
		} catch (error) {
			console.error('Error saving grades:', error);
		}
	}

	async fetchAssignmentsForCurrentCourses() {
		new Notice('Fetching assignments for current courses...');
		
		const courseFolders = await this.getCurrentCourseFolders();
		const canvasCourses = await this.fetchCourses();
		if (!canvasCourses) return;

		let count = 0;
		for (const folder of courseFolders) {
			const course = canvasCourses.find(c => this.matchCourseToFolder(c, folder.name));
			if (course) {
				const assignments = await this.fetchCourseAssignments(course.id);
				if (assignments) {
					await this.saveAssignments(folder.path, assignments, course, folder.name);
					count++;
				}
			}
		}

		new Notice(`✓ Updated assignments for ${count} course(s)`);
	}

	async fetchGradesForCurrentCourses() {
		new Notice('Fetching grades for current courses...');
		
		const courseFolders = await this.getCurrentCourseFolders();
		const canvasCourses = await this.fetchCourses();
		if (!canvasCourses) return;

		let count = 0;
		for (const folder of courseFolders) {
			const course = canvasCourses.find(c => this.matchCourseToFolder(c, folder.name));
			if (course) {
				const grades = await this.fetchCourseGrades(course.id);
				if (grades && grades.length > 0) {
					await this.saveGrades(folder.path, course, grades[0], folder.name);
					count++;
				}
			}
		}

		new Notice(`✓ Updated grades for ${count} course(s)`);
	}

	onunload() {
		console.log('Unloading Canvas LMS Integration plugin');
	}
}

class CanvasLMSSettingTab extends PluginSettingTab {
	plugin: CanvasLMSPlugin;

	constructor(app: any, plugin: CanvasLMSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Canvas LMS Integration Settings' });

		new Setting(containerEl)
			.setName('Canvas URL')
			.setDesc('Your Canvas instance URL (e.g., https://northeastern.instructure.com)')
			.addText(text => text
				.setPlaceholder('https://your-school.instructure.com')
				.setValue(this.plugin.settings.canvasUrl)
				.onChange(async (value) => {
					this.plugin.settings.canvasUrl = value.trim();
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('API Token')
			.setDesc('Your Canvas API token (Account > Settings > New Access Token)')
			.addText(text => {
				text.setPlaceholder('Enter your Canvas API token')
					.setValue(this.plugin.settings.apiToken)
					.onChange(async (value) => {
						this.plugin.settings.apiToken = value.trim();
						await this.plugin.saveSettings();
					});
				text.inputEl.type = 'password';
			});

		containerEl.createEl('p', {
			text: 'To get your API token: Go to Canvas > Account > Settings > scroll to "Approved Integrations" > click "+ New Access Token"',
			attr: { style: 'font-size: 0.9em; color: var(--text-muted); margin-top: -10px; margin-bottom: 20px;' }
		});

		new Setting(containerEl)
			.setName('Sync Folder')
			.setDesc('Folder where your current courses are located')
			.addText(text => text
				.setPlaceholder('01-Active')
				.setValue(this.plugin.settings.syncFolder)
				.onChange(async (value) => {
					this.plugin.settings.syncFolder = value.trim();
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('p', {
			text: 'The plugin will only sync courses that match existing folders in this directory.',
			attr: { style: 'font-size: 0.9em; color: var(--text-muted); margin-top: -10px; margin-bottom: 20px;' }
		});

		new Setting(containerEl)
			.setName('Test Connection')
			.setDesc('Test your Canvas API connection')
			.addButton(button => button
				.setButtonText('Test Connection')
				.onClick(async () => {
					const courses = await this.plugin.fetchCourses();
					if (courses) {
						new Notice(`✓ Connected! Found ${courses.length} active courses on Canvas`);
						
						const courseFolders = await this.plugin.getCurrentCourseFolders();
						new Notice(`Found ${courseFolders.length} course folders in ${this.plugin.settings.syncFolder}`);
					}
				}));

		new Setting(containerEl)
			.setName('Sync Current Courses')
			.setDesc('Sync only your current course folders with Canvas')
			.addButton(button => button
				.setButtonText('Sync Current Courses')
				.setCta()
				.onClick(async () => {
					await this.plugin.syncCurrentCourses();
				}));
	}
}
