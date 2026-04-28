<script lang="ts">
	import { Toggle } from 'flowbite-svelte';
	import { MoonSolid, SunSolid } from 'flowbite-svelte-icons';
	import Content from '$lib/components/Content.svelte';
	import { theme } from '$lib/stores/theme';

	$: isDark = $theme === 'dark';

	function handleToggle() {
		theme.toggle();
	}
</script>

<svelte:head>
	<title>Definições</title>
</svelte:head>

<Content>
	<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Definições</h1>

	<section class="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
		<div class="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
			<h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
				Aparência
			</h2>
		</div>

		<div class="flex items-center justify-between px-4 py-4">
			<div class="flex items-center gap-3">
				{#if isDark}
					<MoonSolid class="h-5 w-5 text-gray-600 dark:text-gray-300" />
				{:else}
					<SunSolid class="h-5 w-5 text-gray-600 dark:text-gray-300" />
				{/if}
				<div>
					<p class="text-sm font-medium text-gray-900 dark:text-white">Modo escuro</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{isDark ? 'Ativo' : 'Inativo'}
					</p>
				</div>
			</div>
			<Toggle checked={isDark} onchange={handleToggle} />
		</div>
	</section>
</Content>
