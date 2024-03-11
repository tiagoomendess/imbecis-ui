<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Label, Input, Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Img } from 'flowbite-svelte';
	import { location } from '$lib/stores/location';
	import type { Coordinates, VoteRequest } from '$lib/types';
	import Centro from '$lib/Centro.svelte';
	import { isLoading } from '$lib/stores/loading';
	import { submitReportVote } from '$lib/api';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let plateCountry = 'pt' as string;
	let plateNumber = '' as string;
	let showLocWarning = false as boolean;

	$: $isLoading = $isLoading;
	$: canAdvance = false as boolean;
	$: {
		canAdvance = validatePlateNumber(plateNumber);
	}

	let coordinates = { latitude: 0, longitude: 0 } as Coordinates;

	onMount(async () => {
		await preLoadCoordinates();
		console.log('Vote page mounted');
		console.log('Coordinates: ', coordinates);
		location.subscribe((value: Coordinates) => {
			coordinates.latitude = value.latitude;
			coordinates.longitude = value.longitude;
		});
	});

	const hasCoordinates = () => {
		return coordinates.latitude !== 0 && coordinates.longitude !== 0;
	};

	const preLoadCoordinates = async () => {
		if (!hasCoordinates()) {
			await askForGeolocation();
		}
	};

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

	const notSureClicked = async () => {
		submitVeredict('not_sure');
	};

	const imbecileClicked = async () => {
		submitVeredict('imbecile');
	};

	const submitVeredict = async (veredict: string = 'not_sure') => {
		const plate = normalizePlateNumber(plateNumber);
		console.log(`Veredict is ${veredict} for ${plate}`);
		$isLoading = true;

		const request: VoteRequest = {
			plateNumber: plate,
			plateCountry: plateCountry,
			result: veredict
		};

		// send request to api
		const success = await submitReportVote(data.reportForReview?.id || '', request);

		// reset view values
		if (success) {
			plateNumber = '';
		} else {
			alert('Voto não foi registado');
		}

		await goto('/vote', { replaceState: true, invalidateAll: true });
		$isLoading = false;
	};

	const countryClicked = () => {
		console.log('Country');
	};

	const askForGeolocation = async () => {
		const locationOptions = {
			enableHighAccuracy: true,
			timeout: 7000,
			maximumAge: 0
		};

		navigator.geolocation.getCurrentPosition(geoSuccess, getError, locationOptions);
	};

	const geoSuccess = (position: GeolocationPosition) => {
		showLocWarning = false;
		location.set({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	};

	const getError = (error: GeolocationPositionError) => {
		console.log(`Could not get geo location: ${error.code}, ${error.message}`);
		showLocWarning = true;
	};
</script>

<Centro show={showLocWarning}>
	<svg
		class="w-[100px] h-[100px] text-gray-800 dark:text-white"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			fill-rule="evenodd"
			d="M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
			clip-rule="evenodd"
		/>
	</svg>
	<Heading tag="h2" class="mt-2 text-center mb-4">Localização</Heading>
	<P class="text-center mb-4"
		>Precisa de permitir a localização para poder votar. Usamos a localização para não mostrar
		denúncias perto de si. A localização não é guardada no momento do voto, apenas é utilizada para
		pedir um possível imbecil longe de onde está atualmente.</P
	>
	<Button
		on:click={() => {
			askForGeolocation();
			window.location.reload();
		}}
		color="light"
		class="mb-2">Dar Permissão</Button
	>
</Centro>

{#if data.reportForReview != null}
	<div>
		<div class="mb-2 aspect-square bg-gradient-to-r from-gray-200 to-gray-500 rounded-lg">
			<Img src={data.reportForReview?.picture} alt={data.reportForReview?.id} class="rounded-lg" />
		</div>

		<div class="flex mb-2">
			<!-- Matricula 🇵🇹 -->
			<div class="w-2/12">
				<Button
					on:click={countryClicked}
					id="country_button"
					color="light"
					class="text-center mt-7 pl-2 pr-2 w-full">🇵🇹</Button
				>
			</div>
			<div class="w-10/12 pl-2">
				<Label for="plate_input" class="block mb-2 text-center">Matrícula</Label>
				<Input
					bind:value={plateNumber}
					class="text-center uppercase"
					id="plate_input"
					placeholder="AA 00 AA"
				/>
			</div>
		</div>

		<div class="flex">
			<!-- Vote Butons -->
			<div class="w-8/12 mr-1">
				<Button on:click={notSureClicked} class="w-full" color="green">Não Tenho a Certeza</Button>
			</div>
			<div class="w-4/12">
				<Button on:click={imbecileClicked} disabled={!canAdvance} class="w-full" color="red"
					>É Imbecil</Button
				>
			</div>
		</div>
	</div>
{/if}

{#if data.reportForReview == null}
	<Centro>
		<svg
			class="w-[100px] h-[100px] text-gray-800 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1"
				d="m8 12 2 2 5-5m4.5 5.3 1-.9a2 2 0 0 0 0-2.8l-1-.9a2 2 0 0 1-.6-1.4V7a2 2 0 0 0-2-2h-1.2a2 2 0 0 1-1.4-.5l-.9-1a2 2 0 0 0-2.8 0l-.9 1a2 2 0 0 1-1.4.6H7a2 2 0 0 0-2 2v1.2c0 .5-.2 1-.5 1.4l-1 .9a2 2 0 0 0 0 2.8l1 .9c.3.4.6.9.6 1.4V17a2 2 0 0 0 2 2h1.2c.5 0 1 .2 1.4.5l.9 1a2 2 0 0 0 2.8 0l.9-1a2 2 0 0 1 1.4-.6H17a2 2 0 0 0 2-2v-1.2c0-.5.2-1 .5-1.4Z"
			/>
		</svg>
		<Heading tag="h2" class="mt-2 text-center mb-4">Tudo Analisado</Heading>
		<P class="text-center"
			>Não temos mais potenciais imbecís por agora, por favor volte mais tarde.</P
		>
	</Centro>
{/if}
