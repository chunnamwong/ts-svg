import { defineConfig } from 'eslint/config';

export default defineConfig([
	{
		files: ['**/*.js'],
		extends: [
			{
				name: 'eslint:recommended',
			},
		],
	},
]);
