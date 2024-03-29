<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Heading,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		A,
		PaginationItem,
		P
	} from 'flowbite-svelte';

	export let data: PageData;
	let maxPage = Math.ceil(data.platesResponse.total / 10);
	$: queryParams = $page.url.searchParams;
	$: currentPage = parseInt(queryParams.get('page') ?? '1');

	const getFlag = (country: string): string => {
		switch (country) {
			case 'pt':
				return '🇵🇹';
			default:
				return '🌍';
		}
	};

	const formatPlate = (country: string, number: string): string => {
		switch (country) {
			case 'pt':
				return formatPortuguesePlate(number);
			default:
				return number;
		}
	};

	const formatPortuguesePlate = (number: string): string => {
		if (number.length === 6) {
			return `${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)}`;
		}

		return number;
	};

	const previous = () => {
		if (currentPage <= 1) {
			return;
		}

		currentPage -= 1;
		goto(`?page=${currentPage}`, { replaceState: true });
	};

	const next = () => {
		if (currentPage >= maxPage) {
			return;
		}

		currentPage += 1;
		goto(`?page=${currentPage}`, { replaceState: true });
	};
</script>

<svelte:head>
    <title>Imbecis :: Matrículas</title>
</svelte:head>

<Heading class="mb-5">Matrículas</Heading>

<Table class="mb-5">
	<TableHead>
		<TableHeadCell>País</TableHeadCell>
		<TableHeadCell>Matrícula</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.platesResponse.plates as plate}
			<TableBodyRow>
				<TableBodyCell>
					{getFlag(plate.country)}
				</TableBodyCell>
				<TableBodyCell
					><A href={`/matriculas/${plate.country}/${plate.number}`}
						>{formatPlate(plate.country, plate.number)}</A
					></TableBodyCell
				>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<div class="mb-2">
	<P size="sm" class="text-center">Página {queryParams.get('page') ?? 1} de {maxPage}</P>
</div>

<div class="flex space-x-3 rtl:space-x-reverse justify-center">
	{#if currentPage > 1}
		<a href={`?page=${currentPage - 1}`}>
			<PaginationItem large>Anterior</PaginationItem>
		</a>
	{/if}

	{#if currentPage < maxPage}
		<a href={`?page=${currentPage + 1}`}>
			<PaginationItem large>Próxima</PaginationItem>
		</a>
	{/if}
</div>
