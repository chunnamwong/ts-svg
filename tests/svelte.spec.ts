import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

test.describe('dev server', () => {
	test('renders correctly', async ({ page }) => {
		await page.goto('/');
		// Only compare the icons so that the test can run aross platform
		await expect(page.getByRole('article')).toHaveScreenshot();
	});

	test('handles hot reload correctly', async ({ page, browserName }) => {
		const iconFolderPath = path.join(process.cwd(), `examples/svelte/src/lib/assets/icons`);
		const testRoute = `/test-hot-reload-${browserName}`;
		const testPagePath = path.join(
			process.cwd(),
			`examples/svelte/src/routes/${testRoute}/+page.svelte`,
		);
		await fs.mkdir(path.dirname(testPagePath), { recursive: true });
		await fs.writeFile(testPagePath, '');
		// Wait for the dev server
		await new Promise((resolve) => setTimeout(resolve, 500));
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
	});
});

test.describe('production build preview server', () => {
	test('renders correctly', async ({ page }) => {
		await page.goto('http://localhost:4173');
		// Only compare the icons so that the test can run aross platform
		await expect(page.getByRole('article')).toHaveScreenshot();
	});
});
