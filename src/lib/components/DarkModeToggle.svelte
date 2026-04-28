<script lang="ts">
	import { SunSolid, MoonSolid } from 'flowbite-svelte-icons';
	import { theme } from '$lib/stores/theme';
</script>

<button
	onclick={() => theme.toggle()}
	aria-label="Toggle dark mode"
	class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
>
	{#if $theme === 'dark'}
		<SunSolid class="h-5 w-5" />
	{:else}
		<MoonSolid class="h-5 w-5" />
	{/if}
</button>
