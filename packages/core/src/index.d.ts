import type { Plugin, PluginOption } from 'vite';

type Options = {
	path: string;
	query?: '?raw' | '?react' | '?svelte' | (string & Record<never, never>);
	transform?: Plugin['transform'];
	svgModuleDeclaration?: string;
};

export function tsSvg(opts: Options): PluginOption & { tsSvgOptions: Options };
export function syncTypes(
	svgFolderFullPath: string,
	query?: string,
	svgModuleDeclaration?: string,
): void;
