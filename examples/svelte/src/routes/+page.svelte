<script lang="ts">
	import * as Icon from '$lib/Icon';
	import * as Image from '$lib/Image';

	const newIcon = `<Icon.NewIcon />`;
</script>

<h1>@ts-svg/svelte</h1>

<p>
	Try adding a new icon to <code>src/lib/assets/icons</code>, then use it right away:
	<code>{newIcon}</code>
</p>

<div>
	<Image.Favicon />
	<Icon.Home />
	<Icon.Book class="size-200" />
</div>

<style>
	:global(.size-200) {
		width: 200px;
		height: 200px;
	}

	:global(svg) {
		width: 150px;
		height: 150px;
	}

	p {
		font-size: 1rem;
	}
</style>
