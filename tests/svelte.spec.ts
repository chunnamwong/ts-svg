import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

test.describe('dev server', () => {
	test('renders correctly', async ({ page }) => {
		await page.goto('/');
		// Only compare the icons so that the test can run aross platform
		await expect(page.getByRole('article')).toHaveScreenshot();
	});

	test('generates the type for icons', async () => {
		const type = await fs.readFile(
			path.join(process.cwd(), 'examples/svelte/.ts-svg/ambient.d.ts'),
			'utf-8',
		);
		expect(type).toContain(`
declare module "virtual:ts-svg/icons" {
  export const Book: typeof import('*.svg?svelte').default;
	export const Home: typeof import('*.svg?svelte').default;
}
`);
	});
});

test.describe('dev server with new files', () => {
	const iconFolderPath = path.join(process.cwd(), `examples/svelte/src/lib/assets/icons`);
	let testRoute: string;
	let testPagePath: string;

	test.beforeAll(async ({ browserName }) => {
		testRoute = `/test-hot-reload-${browserName}`;
		testPagePath = path.join(process.cwd(), `examples/svelte/src/routes/${testRoute}/+page.svelte`);
	});

	test.beforeEach(async ({ page }) => {
		await fs.mkdir(path.dirname(testPagePath), { recursive: true });
		await fs.writeFile(testPagePath, '');
		await page.waitForTimeout(500);
	});

	test.afterEach(async () => {
		await fs.rm(path.join(iconFolderPath, 'test-home-copy.svg'));
		await fs.rm(testPagePath);
		await fs.rmdir(path.dirname(testPagePath));
	});

	test('handles hot reload correctly', async ({ page }) => {
		await page.goto(testRoute);
		await fs.copyFile(
			path.join(iconFolderPath, 'home.svg'),
			path.join(iconFolderPath, 'test-home-copy.svg'),
		);
		await fs.writeFile(
			testPagePath,
			`
<script lang="ts">
  import { Icon } from '$lib/Icon';
</script>

<Icon.TestHomeCopy />

<style>
	:global(svg) {
		width: 150px;
		height: 150px;
	}
</style>
`,
		);
		await expect(page).toHaveScreenshot();

		// Refresh to ensure SSR works with hot reload
		await page.reload();
		await expect(page).toHaveScreenshot();

		// Ensure it regenerate the type correctly
		const type = await fs.readFile(
			path.join(process.cwd(), 'examples/svelte/.ts-svg/ambient.d.ts'),
			'utf-8',
		);
		expect(type).toContain(`
declare module "virtual:ts-svg/icons" {
  export const Book: typeof import('*.svg?svelte').default;
	export const Home: typeof import('*.svg?svelte').default;
	export const TestHomeCopy: typeof import('*.svg?svelte').default;
}
`);
	});
});

test.describe('production build preview server', () => {
	test('renders correctly', async ({ page }) => {
		await page.goto('http://localhost:4173');
		// Only compare the icons so that the test can run aross platform
		await expect(page.getByRole('article')).toHaveScreenshot();
	});
});
