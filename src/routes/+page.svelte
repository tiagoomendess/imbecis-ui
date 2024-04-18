<script lang="ts">
	import { onMount } from 'svelte';
	import Paragraph from '$lib/Paragraph.svelte';
	import type { PageData } from './$types';
	import ImbecileSq from '$lib/ImbecileSq.svelte';
	import moment from 'moment';
	import { Heading, A } from 'flowbite-svelte';
	import { getFeed, countAvailableReportsForReview } from '$lib/api';
	import { showNotification } from '$lib/utils/notifications';
	import FeedFilter from '$lib/FeedFilter.svelte';
	import { isLoading, loadingMessage } from '$lib/stores/loading';

	export let data: PageData;
	let municipality = '' as string;

	let currentPage = 1 as number;
	let loading = false;
	let pagesLoaded = [1] as number[];

	$: municipalityChanged(municipality);

	const municipalityChanged = async (newMunicipality: string) => {
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
		return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
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
	}

	function isBrowser() {
		return typeof window !== 'undefined';
	}

	onMount(() => {
		if (isBrowser()) {
			window.addEventListener('scroll', handleScroll);

			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
	});

	const countReportsForReview = async () => {
		const count = await countAvailableReportsForReview();

		if (count >= 3) {
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
		<Paragraph align="center">Não existem imbecis em {municipality}. <A href="/adicionar">adicione um</A>.</Paragraph>
	{:else}
		<Paragraph align="center">Não existem imbecis. <A href="/adicionar">adicione um</A>.</Paragraph>
	{/if}
</section>
