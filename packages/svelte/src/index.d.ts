import type { PluginOption } from 'vite';
import type { Config } from 'svgo';

type Options = {
	path: string;
	svgoConfig?: Config;
};

export function tsSvg(opts: Options): PluginOption;
