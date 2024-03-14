<script lang="ts">
	import { Heading, P, Label, Input, Button, Spinner } from 'flowbite-svelte';
    import {  SearchOutline } from 'flowbite-svelte-icons';
    import { getPlateByCountryAndNumber } from '$lib/api';
    import type { Plate } from '$lib/types';
    import { goto } from '$app/navigation';

	let plateNumber = '';
	let plateCountry = 'pt';
    let isSearching = false;

    $: canSearch = false as boolean;
    $: {
		canSearch = validatePlateNumber(plateNumber);
	}

    const countryClicked = () => {
        console.log('country clicked');
        alert('Apenas matrículas Portuguesas são suportadas de momento');
    }

    const normalizePlateNumber = (plateNumber: string) => {
		return plateNumber
			.trim()
			.replace(/[\s\-]+/g, '')
			.toUpperCase();
	};

    const validatePlateNumber = (plateNumber: string) => {
		const regex = /[A-Z0-9]+/;
		plateNumber = normalizePlateNumber(plateNumber);

		switch (plateCountry) {
			case 'pt':
				return regex.test(plateNumber) && plateNumber.length === 6;
			default: // Deal with others later
				return regex.test(plateNumber) && plateNumber.length >= 3;
		}
	};

    const searchClicked = async () => {
        isSearching = true;
        // wait 500ms
        await new Promise(r => setTimeout(r, 500));
        console.log('search clicked');
        const plateStr = normalizePlateNumber(plateNumber);

        const plateObj = await getPlateByCountryAndNumber(plateCountry, plateStr);
        if (!plateObj) {
            console.log('plate not found');
            alert(`${plateStr} não é um imbecil`)
            plateNumber = '';
            isSearching = false;
            return;
        }
        
        await goto(`/matriculas/${plateObj.country}/${plateObj.number}`);
    }
</script>

<Heading class="mb-4">Procurar Imbecil</Heading>

<P class="text-center">Procure por matrícula e país</P>

<div class="search-wrapper">
    <div class="container max-w-md mx-auto p-4 mb-20 flex">
        <div class="w-2/12">
            <Button
            on:click={countryClicked}
            id="country_button"
            color="light"
            class="text-center mt-7 pl-2 pr-2 w-full">🇵🇹</Button
        >
        </div>
        <div class="w-8/12">
            <Label class="space-y-2 ml-2 mr-2 text-center">
                <span>Matrícula</span>
                <Input bind:value={plateNumber} type="text" placeholder="AA 00 AA" size="md" class="text-center uppercase"/>
            </Label>
        </div>
        <div class="w-2/12">
            <Button on:click={searchClicked} disabled={!canSearch} class="w-full text-center mt-7 center" size="md" color="green">&nbsp;
                {#if isSearching}
                    <Spinner class="me-3 text-center" size="4" />
                {:else}
                    <SearchOutline class="w-3.5 h-3.5 me-2" />
                {/if}
                
            </Button>
        </div>
    </div>
</div>

<style>
    .search-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: calc(100vh - 64px);
    }
</style>
