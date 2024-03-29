<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { Label, Input, Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Img } from 'flowbite-svelte';
	import type { VoteRequest } from '$lib/types';
	import Centro from '$lib/Centro.svelte';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import { submitReportVote } from '$lib/api';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let plateCountry = 'pt' as string;
	let plateNumber = '' as string;

	$: $isLoading = $isLoading;
	$: canAdvance = false as boolean;
	$: {
		canAdvance = validatePlateNumber(plateNumber);
	}

	onMount(() => {
		setTimeout(() => {
			initMagnifyingGlass();
		}, 500);
	});

	const initMagnifyingGlass = () => {
		const image = document.querySelector('img');
		const lens = document.getElementById('magnifierLens');
		if (!image || !lens) {
			return;
		}

		image.addEventListener('mousemove', moveMagnifier);
		lens.addEventListener('mousemove', moveMagnifier);

		image.addEventListener('mouseenter', () => {
			lens.style.visibility = 'visible';
		});

		image.addEventListener('mouseleave', () => {
			lens.style.visibility = 'hidden';
		});

		lens.style.backgroundImage = `url('${data.reportForReview?.picture}')`;

		function moveMagnifier(e: any) {
			const pos = getCursorPos(e);
			const x = pos.x;
			const y = pos.y;
			const diameter = 100;
			const radius = diameter / 2;

			if (!lens || !image) return;

			lens.style.left = x - radius + 'px';
			lens.style.top = y - radius + 'px';
			lens.style.backgroundPosition = '-' + (x * 2 - radius) + 'px -' + (y * 2 - radius) + 'px';
			lens.style.backgroundSize = image.offsetWidth * 2 + 'px ' + image.offsetHeight * 2 + 'px';
			lens.style.visibility = 'visible';
		}

		function getCursorPos(e: any) {
			if (!image) return { x: 0, y: 0 };
			const a = image.getBoundingClientRect();
			let x = e.pageX - a.left;
			let y = e.pageY - a.top;
			x = x - window.scrollX;
			y = y - window.scrollY;
			return { x: x, y: y };
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
		loadingMessage.set('A submeter voto');
		$isLoading = true;
		const plate = normalizePlateNumber(plateNumber);
		console.log(`Veredict is ${veredict} for ${plate}`);

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

		loadingMessage.set('A pedir um imbecil fresquinho');
		await goto('/votar', { replaceState: true, invalidateAll: true });
		await new Promise((r) => setTimeout(r, 200));
		$isLoading = false;
	};

	const countryClicked = () => {
		console.log('Country');
		alert('Por agora apenas matrículas portuguesas são aceites');
	};
</script>

{#if data.reportForReview != null}
	<div>
		<div class="mb-2 aspect-square bg-gradient-to-r from-gray-200 to-gray-500 rounded-lg relative">
			<Img src={data.reportForReview?.picture} alt={data.reportForReview?.id} class="rounded-lg" />
			<div id="magnifierLens" class="magnifierLens"></div>
		</div>

		<div class="flex mb-2">
			<!-- Matricula 🇵🇹 -->
			<div class="w-2/12">
				<Button
					on:click={countryClicked}
					id="country_button"
					color="light"
					class="text-center mt-7 pl-2 pr-2 w-full text-lg">🇵🇹</Button
				>
			</div>
			<div class="w-10/12 pl-2">
				<Label for="plate_input" class="block mb-2 text-center">Matrícula</Label>
				<Input
					bind:value={plateNumber}
					class="text-center uppercase text-lg"
					id="plate_input"
					placeholder="AA 00 AA"
					autofocus
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
		<div class="w-full flex justify-center">
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
		</div>
		<Heading tag="h2" class="mt-2 text-center mb-4">Tudo Analisado</Heading>
		<P class="text-center"
			>Não temos mais potenciais imbecís por agora, por favor volte mais tarde.</P
		>
	</Centro>
{/if}

<style>
	.magnifierLens {
		position: absolute;
		border: 3px solid #000;
		border-radius: 50%;
		width: 100px;
		height: 100px;
		visibility: hidden;
		pointer-events: none;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		background: white no-repeat;
		cursor: crosshair;
	}
</style>
