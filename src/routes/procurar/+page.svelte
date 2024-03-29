<script lang="ts">
	import { Heading, P, Label, Input, Button, Spinner } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import { getPlateByCountryAndNumber } from '$lib/api';
	import { goto } from '$app/navigation';
	import { showNotification } from '$lib/utils/notifications';
	import Country from '$lib/Country.svelte';

	let plateNumber = '';
	let isSearching = false;

	$: plateCountry = 'pt';
    $: platePlaceholder = getPlatePlaceholder(plateCountry);
	$: canSearch = false as boolean;
	$: {
        platePlaceholder = getPlatePlaceholder(plateCountry);
		canSearch = validatePlateNumber(plateNumber);
	}

	const normalizePlateNumber = (plateNumber: string) => {
		return plateNumber
			.trim()
			.replace(/[\s\-]+/g, '')
			.toUpperCase();
	};

	const getPlatePlaceholder = (country : string = plateCountry) => {
		switch (country) {
			case 'pt':
				return 'AA 00 AA';
			case 'es':
				return '1234 ABC';
			case 'fr':
				return 'AB 123 XD';
			case 'ch':
				return 'AB 12345';
			default:
				return 'ABC 123';
		}
	};

	const validatePlateNumber = (plateNumber: string) => {
		const regex = /[A-Z0-9]+/;
		plateNumber = normalizePlateNumber(plateNumber);

		switch (plateCountry) {
			case 'pt':
				return regex.test(plateNumber) && plateNumber.length === 6;
			default:
				return regex.test(plateNumber) && plateNumber.length >= 3;
		}
	};

	const searchClicked = async () => {
		isSearching = true;
		const plateStr = normalizePlateNumber(plateNumber);

		const plateObj = await getPlateByCountryAndNumber(plateCountry, plateStr);
		if (!plateObj) {
			console.log('plate not found');
			showNotification(`${plateStr} não foi encontrada`, 'success');
			plateNumber = '';
			isSearching = false;
			return;
		}

		await goto(`/matriculas/${plateObj.country}/${plateObj.number}`);
	};
</script>

<div>
	<Heading class="mb-4">Procurar Imbecil</Heading>

	<P class="text-center">Procure por matrícula e país</P>

	<div class="container max-w-md mx-auto p-4 mb-20 flex mt-8">
		<div class="w-2/12">
			<Country bind:value={plateCountry} />
		</div>
		<div class="w-8/12">
			<Label class="space-y-2 ml-2 mr-2 text-center">
				<span>Matrícula</span>
				<Input
					bind:value={plateNumber}
					type="text"
					placeholder={getPlatePlaceholder()}
					size="md"
					class="text-center uppercase text-lg"
					autofocus
				/>
			</Label>
		</div>
		<div class="w-2/12">
			<Button
				on:click={searchClicked}
				disabled={!canSearch}
				class="w-full text-center mt-7 center text-lg"
				size="md"
				color="green"
				>&nbsp;
				{#if isSearching}
					<Spinner class="me-3 text-center" size="4" />
				{:else}
					<SearchOutline class="w-3.5 h-3.5 me-2" />
				{/if}
			</Button>
		</div>
	</div>
</div>
