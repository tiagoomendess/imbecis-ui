<script lang="ts">
	import { FilterOutline } from 'flowbite-svelte-icons';
	import { Modal, Button } from 'flowbite-svelte';
	import { MUNICIPALITIES } from '$lib/utils/constants';

	export let municipality = '';
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
	};

	const handleFilterReset = () => {
		municipality = '';
		searchText = '';
		filterModal = false;
	};

	const selectMunicipality = (name: string, event : any) => {
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
				<span>{municipality}</span>
			{/if}
		</div>
		<div class="">
			<FilterOutline
				class="right-0 text-right cursor-pointer"
				on:click={() => {
					filterModal = true;
				}}
			/>
		</div>
	</div>
</div>

<Modal title="Filtrar Imbecis" bind:open={filterModal} autoclose outsideclose class="h-full">
	<div class="flex-row justify-center">
        <small>Município:</small>
		<input
			type="text"
			bind:value={searchText}
			placeholder="Comece a escrever o nome do município..."
			class="form-input"
		/>
		{#if showAutoComplete}
			<ul class="list-group">
				{#each filteredMunicipalities as m}
					<li class="list-item no-padding-important">
						<button on:click={() => selectMunicipality(m, event)} class="full-width-button">
							{m}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
	<svelte:fragment slot="footer">
		<Button disabled={!canFilter} on:click={handleFilterClicked}>Filtrar</Button>
		<Button on:click={handleFilterReset} color="alternative">Limpar</Button>
	</svelte:fragment>
</Modal>

<style>
    .no-padding-important {
        padding: 0px!important;
    }
    .full-width-button {
        width: 100%;
        background: none;
        border: none;
        text-align: left;
        padding: 8px;
        cursor: pointer;
    }
    .full-width-button:hover {
        background-color: #f8f9fa;
    }
	.filter {
		height: 24px;
	}
	.form-input {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.list-group {
		width: 100%;
		list-style: none;
		padding: 0;
		margin-top: 0;
		background-color: #fff;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.list-item {
		padding: 8px;
		border-bottom: 1px solid #ddd;
		cursor: pointer;
	}
	.list-item:last-child {
		border-bottom: none;
	}
	.list-item:hover {
		background-color: #f8f9fa;
	}
</style>
