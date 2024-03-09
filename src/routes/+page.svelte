<script lang="ts">
	import Title from '$lib/Title.svelte';
	import Paragraph from '$lib/Paragraph.svelte';
	import type { PageData } from './$types';
	import { getContext } from 'svelte';
	import ImbecileSq from '$lib/ImbecileSq.svelte';
	import moment from 'moment';
	import { Heading } from 'flowbite-svelte';

	export let data: PageData;

	const user = getContext('user');
</script>

<section class="bg-white dark:bg-gray-900">
	<Heading class="mb-4">Feed</Heading>

	{#each data.reports as report}
		<ImbecileSq
			picture={report.picture}
			plateNumber={report.plate?.number}
			plateCountry={report.plate?.country}
			date={moment(report.createdAt).format('D/M/YYYY') ?? null}
			municipality={report.municipality ?? null}
		/>
	{/each}

	<Paragraph align="center">Scroll infinito ainda não está pronto</Paragraph>
</section>
