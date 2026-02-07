#!/usr/bin/env node

import { resolveConfig } from 'vite';
import path from 'node:path';
import { syncTypes } from './index.js';

export async function main() {
	const config = await resolveConfig({}, 'build');

	const tsSvgPluginConfig = config.plugins.find(({ name }) => name === 'ts-svg');

	if (!tsSvgPluginConfig) {
		throw new Error('cannot find ts-svg plugin from vite config');
	}

	const { path: svgFolderPath, query, svgModuleDeclaration } =
		/**
		 * @type {import('vite').Plugin & {tsSvgOptions: import('./index.js').Options}}
		 */
		(tsSvgPluginConfig).tsSvgOptions;

	if (!path) {
		throw new Error('cannot find path option');
	}

	const svgFolderFullPath = path.join(process.cwd(), svgFolderPath);

	syncTypes(svgFolderFullPath, query, svgModuleDeclaration);
}

await main();
