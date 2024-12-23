<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Paragraph from '$lib//components/Paragraph.svelte';
	import type { PageData } from './$types';
	import ImbecileSq from '$lib/components/ImbecileSq.svelte';
	import moment from 'moment';
	import { Heading, A, Alert } from 'flowbite-svelte';
	import { getFeed, countAvailableReportsForReview } from '$lib/api';
	import { showNotification } from '$lib/utils/notifications';
	import FeedFilter from '$lib/components/FeedFilter.svelte';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import { MUNICIPALITIES } from '$lib/utils/constants';
	import { goto } from '$app/navigation';
	import Content from '$lib/components/Content.svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	export let data: PageData;
	let municipality = '' as string;
	let currentPage = 1 as number;
	let loading = false;
	let pagesLoaded = [1] as number[];
	let listenTochanges = false;

	$: municipalityChanged(municipality);

	setInterval(() => {
		listenTochanges = true;
	}, 1000);

	const municipalityChanged = async (newMunicipality: string) => {
		if (newMunicipality !== '' && !MUNICIPALITIES.includes(newMunicipality)) {
			municipality = '';
			goto('/');
			return;
		}

		if (!listenTochanges) {
			return;
		}

		isLoading.set(true);

		let loadingMsg = 'A procurar imbecis em todo o lado';
		if (newMunicipality !== '') {
			loadingMsg = `A procurar imbecis em ${newMunicipality}`;
		}

		loadingMessage.set(loadingMsg);

		municipality = newMunicipality;
		currentPage = 1;
		pagesLoaded = [1];
		data.reports = [];
		data.reports = await getFeed(currentPage, municipality);
		isLoading.set(false);
	};

	// Function to check if the user is near the bottom of the page
	function isNearBottom() {
		if (!window) {
			return false;
		}

		return document.body.offsetHeight - window.innerHeight <= window.scrollY + (window.innerHeight * 0.15);
	}

	const handleScroll = () => {
		if (isNearBottom() && !loading) {
			loadMore();
		}
	};

	// Function to load more data
	async function loadMore() {
		if (loading || pagesLoaded.includes(currentPage + 1)) {
			return;
		}

		loading = true;
		pagesLoaded.push(currentPage + 1);

		const newData = await getFeed(currentPage + 1, municipality);
		if (newData.length > 0) {
			currentPage += 1;

			data.reports = [...data.reports, ...newData];
		}

		loading = false;

		if (currentPage === 3) {
			countReportsForReview();
		}

		if (currentPage === 4) {
			showNotification('Visite o subreddit r/imbecis');
		}

		if (currentPage === 5) {
			showNotification('Leia a página "Sobre" para saber mais sobre o projeto');
		}
	}

	function isBrowser() {
		return typeof window !== 'undefined';
	}

	onMount(() => {
		if (isBrowser()) {
			if (window) {
				window.addEventListener('scroll', handleScroll);
			}
		}
	});

	onDestroy(() => {
		if (isBrowser() && window) {
			window.removeEventListener('scroll', handleScroll);
		}
	});

	const countReportsForReview = async () => {
		const count = await countAvailableReportsForReview();

		if (count >= 2) {
			showNotification(`Existem ${count} possíveis imbecis à espera na página de votar.`);
		}
	};
</script>

<svelte:head>
	<title>Imbecis App</title>
	<meta property="og:title" content="Imbecis App" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/imbecis_logo_300.png" />
	<meta
		property="og:description"
		content="Lista nacional de imbecis. Estacionamentos abusivos catalogados por Município. Adicione ou encontre imbecis por matrícula."
	/>
</svelte:head>

<Content>
	<section class="bg-white dark:bg-gray-900">
		<Heading class="mb-4">Imbecis</Heading>

		<FeedFilter bind:municipality />

		{#if data.reports.length > 0}
			{#each data.reports as report}
				<ImbecileSq
					id={report.id}
					picture={report.picture}
					plateNumber={report.plate?.number}
					plateCountry={report.plate?.country}
					date={moment(report.createdAt).format('D/M/YYYY') ?? null}
					municipality={report.municipality ?? null}
				/>
			{/each}

			{#if loading}
				<Paragraph align="center">A carregar mais...</Paragraph>
			{:else}
				<Paragraph align="center"
					>Não existem mais imbecis, <A href="/adicionar">adicione um</A></Paragraph
				>
			{/if}
		{:else if municipality != ''}
			<Paragraph align="center"
				>Não existem imbecis em {municipality}. <A href="/adicionar">adicione um</A>.</Paragraph
			>
		{:else}
			<Paragraph align="center"
				>Não existem imbecis. <A href="/adicionar">adicione um</A>.</Paragraph
			>
		{/if}
	</section>
</Content>
