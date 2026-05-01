<script lang="ts">
	import { FilterOutline } from 'flowbite-svelte-icons';
	import { Modal, Button } from 'flowbite-svelte';
	import { MUNICIPALITIES } from '$lib/utils/constants';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let municipality = '';

	$: municipality = decodeURI($page.url.searchParams.get('municipio') || '');

	let filterModal = false;
	let showAutoComplete = false;
	let canFilter = false;

	let searchText = municipality; // To hold the search text

	// Sample data - replace this with your actual data source
	let municipalities = MUNICIPALITIES;

	// Computed property to filter the list based on search text
	$: filteredMunicipalities = municipalities
		.filter((m) => m.toLowerCase().includes(searchText.toLowerCase()))
		.slice(0, 5);

	$: showAutoComplete = searchText.length > 0;
	$: canFilter = MUNICIPALITIES.includes(searchText);

	const handleFilterClicked = () => {
		municipality = searchText;
		filterModal = false;
		goto(`?municipio=${municipality}`);
	};

	const handleFilterReset = () => {
		municipality = '';
		searchText = '';
		filterModal = false;
		$page.url.searchParams.delete('municipio');
		goto('/');
	};

	const selectMunicipality = (name: string, event: any) => {
		event.stopPropagation();
		searchText = name;
		setTimeout(() => {
			showAutoComplete = false;
		}, 15);
	};
</script>

<div class="mb-5 mr-1 ml-1">
	<div class="flex flex-row justify-between filter">
		<div class="w-11/12">
			{#if municipality != ''}
				<span class="text-gray-900 dark:text-white">{municipality}</span>
			{/if}
		</div>
		<div class="">
		<FilterOutline
			class="right-0 text-right cursor-pointer text-gray-900 dark:text-white"
			onclick={() => {
				filterModal = true;
			}}
		/>
		</div>
	</div>
</div>

<Modal title="Filtrar Imbecis" bind:open={filterModal} outsideclose>
	<div class="flex-row justify-center">
		<small>Município:</small>
		<input
			type="text"
			bind:value={searchText}
			placeholder="Comece a escrever o nome do município..."
			class="w-full p-2 mb-2.5 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
		/>
		{#if showAutoComplete}
			<ul class="w-full list-none p-0 mt-0 bg-white border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">
				{#each filteredMunicipalities as m}
					<li class="p-0 border-b border-gray-200 last:border-b-0 dark:border-gray-600">
						<button
							onclick={(e) => selectMunicipality(m, e)}
							class="w-full bg-transparent border-none text-left p-2 cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
						>
							{m}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	{#snippet footer()}
		<Button disabled={!canFilter} onclick={handleFilterClicked}>Filtrar</Button>
		<Button onclick={handleFilterReset} color="alternative">Limpar</Button>
	{/snippet}
</Modal>

<style>
	.filter {
		height: 24px;
	}
</style>
