<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { Label, Input, Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Img } from 'flowbite-svelte';
	import type { VoteRequest } from '$lib/types';
	import Centro from '$lib/components/Centro.svelte';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import { submitReportVote } from '$lib/api';
	import { goto } from '$app/navigation';
	import { showNotification } from '$lib/utils/notifications';
	import Country from '$lib/components/Country.svelte';
	import Content from '$lib/components/Content.svelte';

	export let data: PageData;
	let plateCountry = 'pt' as string;
	let plateNumber = '' as string;
	let tutorialModal = false as boolean;

	$: $isLoading = $isLoading;
	$: canAdvance = false as boolean;
	$: {
		canAdvance = validatePlateNumber(plateNumber);
	}

	onMount(() => {
		setTimeout(() => {
			initMagnifyingGlass();
		}, 500);

		loadTutorialModal();
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
			lens.style.backgroundPosition = '-' + (x * 3 - radius) + 'px -' + (y * 3 - radius) + 'px';
			lens.style.backgroundSize = image.offsetWidth * 3 + 'px ' + image.offsetHeight * 3 + 'px';
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

	const loadTutorialModal = () => {
		const understandTutorialModalAt = localStorage.getItem('voteTutorialModalAt');
		if (!understandTutorialModalAt) {
			tutorialModal = true;
			return;
		}

		const date = new Date(understandTutorialModalAt);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = diff / 1000;

		tutorialModal = seconds > 60 * 60 * 24 * 5;
	};

	const handleUnderstandTutorialClicked = () => {
		localStorage.setItem('voteTutorialModalAt', new Date().toISOString());
		tutorialModal = false;
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

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && canAdvance) {
			imbecileClicked();
		}
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
		const response = await submitReportVote(data.reportForReview?.id || '', request);

		// reset view values
		if (response.success) {
			plateNumber = '';
			plateCountry = 'pt';
			showNotification('Voto registado com sucesso', 'success');
		} else {
			showNotification(`Erro. ${response.message}`, 'error');
		}

		loadingMessage.set('A pedir um imbecil fresquinho');
		await goto('/votar', { replaceState: true, invalidateAll: true });
		await new Promise((r) => setTimeout(r, 200));
		initMagnifyingGlass();
		$isLoading = false;
	};
</script>

<svelte:head>
	<title>Imbecis :: Votar</title>
</svelte:head>

<Content>
	{#if data.reportForReview != null}
		<div>
			<div
				class="mb-2 aspect-square bg-gradient-to-r from-gray-200 to-gray-500 rounded-lg relative"
			>
				<Img
					src={data.reportForReview?.picture}
					alt={data.reportForReview?.id}
					class="rounded-lg"
				/>
				<div id="magnifierLens" class="magnifierLens"></div>
			</div>

			<div class="flex mb-2">
				<!-- Matricula 🇵🇹 -->
				<div class="w-2/12">
					<Country bind:value={plateCountry} />
				</div>
				<div class="w-10/12 pl-2">
					<Label for="plate_input" class="block mb-2 text-center">Matrícula</Label>
					<Input
						bind:value={plateNumber}
						on:keydown={handleKeyDown}
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
					<Button on:click={notSureClicked} class="w-full" color="green">Não Tenho a Certeza</Button
					>
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

	<Modal
		title="Antes de votar lembre-se:"
		bind:open={tutorialModal}
		autoclose={false}
		outsideclose={false}
		class="z-60"
	>
		<ul class="mt-1.5 ms-4 list-disc list-inside text-gray-600">
			<li>Se não tem a certeza absoluta que é contra-ordenação, clique "Não tenho a certeza"</li>
			<li>Se não conseguir ler bem a matrícula, clique "Não tenho a certeza"</li>
			<li>
				Se a viatura está em contra-ordenação e consegue ler a matrícula, insira-a e clique "É
				Imbecil"
			</li>
			<li>Se a matrícula não for Portuguesa tenha o cuidado de alterar o país</li>
		</ul>
		<p class="mb-4">
			Seja honesto e contribua, não tem mal se errar involuntáriamente, apenas as denuncias que reúnam consenso
			serão enviadas para as autoridades.
		</p>
		<Button class="mt-8 w-full" color="green" on:click={() => handleUnderstandTutorialClicked()}
			>Entendi</Button
		>
	</Modal>
</Content>

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
