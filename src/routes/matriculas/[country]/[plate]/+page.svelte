<script lang="ts">
	import type { PageData } from './$types';
	import ImbecileSq from '$lib/ImbecileSq.svelte';
	import { P, Heading } from 'flowbite-svelte';
	import moment from 'moment';

	export let data: PageData;
</script>

<svelte:head>
	{#if data.plate}
		<title>Imbecis :: {data.plate?.number}</title>
		<meta property="og:title" content={`Imbecis :: ${data.plate?.number}`} />
        <meta property="og:description" content={`O proprietário do veículo com a matrícula ${data.plate.number} é um imbecil.`}/>
	{:else}
		<title>Imbecis :: Matrícula</title>
		<meta property="og:title" content={`Imbecis :: Matrículas`} />
	{/if}
	{#if data.reports && data.reports.length > 0}
		<meta property="og:image" content={data.reports[0].picture} />
	{/if}
</svelte:head>

{#if data.reports && data.reports.length > 0 && data.plate}
	<div>
		<Heading tag="h1" class="text-xxl mb-2">{data.plate.number} é um imbecil</Heading>
		<P class="mb-5 text-justify">
			O proprietário da viatura com a matrícula {data.plate.number} é um imbecil, já estacionou abusivamente
			pelo menos
			{#if data.reports.length === 1}
				uma vez. Confira a denuncia abaixo.
			{:else}
				{data.reports.length} vezes. Confira as denuncias abaixo.
			{/if}
		</P>
	</div>
	{#each data.reports as report}
		<ImbecileSq
            id={report.id}
			picture={report.picture}
			plateNumber={data.plate?.number}
			date={moment(report.createdAt).format('D/M/YYYY') ?? null}
			municipality={report.municipality ?? null}
		/>
	{/each}
	<div class="flex">
		<P>
			Ou se calhar não é esta a matrícula, qualquer utilizador pode escrever o que quiser no
			formulário. Não é possível ter a certeza absoluta, mas pode ser. Cada um tira as conclusões
			que quiser.
		</P>
	</div>
{:else}
	<Heading tag="h1" class="text-xxl mb-2">Estranho</Heading>
	<P class="text-justify">
		A Matrícula existe no sistema mas não há denuncias confirmadas. Isto pode ser um erro do sistema
		ou pode indicar que uma denuncia foi removida.
	</P>
{/if}
