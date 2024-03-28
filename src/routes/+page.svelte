<script lang="ts">
	import { onMount } from 'svelte';
	import Paragraph from '$lib/Paragraph.svelte';
	import type { PageData } from './$types';
	import ImbecileSq from '$lib/ImbecileSq.svelte';
	import moment from 'moment';
	import { Heading, A } from 'flowbite-svelte';
	import { getFeed } from '$lib/api';

	export let data: PageData;

	let currentPage = 1 as number;
	let loading = false;
	const pagesLoaded = [1] as number[];

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
			return
		}

		loading = true;
		pagesLoaded.push(currentPage + 1);

		const newData = await getFeed(currentPage + 1);
		if (newData.length > 0) {
			currentPage += 1;
			
			data.reports = [...data.reports, ...newData];
		}

		loading = false;
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
</script>

<section class="bg-white dark:bg-gray-900">
	<Heading class="mb-4">Imbecis App</Heading>

	{#each data.reports as report}
		<ImbecileSq
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
		<Paragraph align="center">Não existem mais imbecis, <A href="/adicionar">adicione um</A></Paragraph>
	{/if}
</section>
