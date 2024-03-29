<script lang="ts">
	import { Button, Modal, Radio } from 'flowbite-svelte';

	export let value: string = 'pt';
	let showModal = false;

	function buttonClicked() {
		showModal = true;
	}

	function countryClicked() {
		setTimeout(() => {
			showModal = false;
		}, 180);
	}

	function getCountryFlagImg(country: string) {
		return `/flags/${country}.svg`;
	}
</script>

<div class="w-full">
	<Button
		on:click={buttonClicked}
		id="country_button"
		color="light"
		class="text-center mt-7 pl-2 pr-2 w-full text-lg"
	>
		<img src={getCountryFlagImg(value)} class="button-flag" alt={value} />
	</Button>
</div>

<Modal title="Escola o País da Matrícula" bind:open={showModal}>
	<ul
		class="w-48 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-600 divide-y divide-gray-200 dark:divide-gray-600 w-full"
	>
		<li>
			<Radio on:click={countryClicked} class="p-3" bind:group={value} value="pt">Portugal</Radio>
		</li>
		<li>
			<Radio on:click={countryClicked} class="p-3" bind:group={value} value="fr">França</Radio>
		</li>
		<li>
			<Radio on:click={countryClicked} class="p-3" bind:group={value} value="ch">Suiça</Radio>
		</li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="lu">Luxemburgo</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="de">Alemanha</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="ad">Andorra</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="be">Bélgica</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="dk">Dinamarca</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="es">Espanha</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="it">Itália</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="nl">Países Baixos</Radio>
        </li>
        <li>
            <Radio on:click={countryClicked} class="p-3" bind:group={value} value="gb">Reino Unido</Radio>
        </li>
	</ul>
</Modal>

<style>
	.button-flag {
		max-height: 26px;
		height: 26px;
	}
</style>
