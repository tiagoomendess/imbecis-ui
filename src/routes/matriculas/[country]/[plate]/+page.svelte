<script lang="ts">
	import type { PageData } from './$types';
	import ImbecileSq from '$lib/components/ImbecileSq.svelte';
	import { P, Heading, Button } from 'flowbite-svelte';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import Content from '$lib/components/Content.svelte';

	export let data: PageData;
	export const prerender = true;
	export const ssr = true;

	let disclaimerMsg = '';
	const msgs = [
		'Pode haver engano quanto à matrícula informada, levando em conta a liberdade que o formulário proporciona para que as pessoas registrem o que quiserem. A falta de certeza absoluta não descarta a hipótese. A interpretação final, contudo, fica a cargo do discernimento individual de quem analisa a situação.',
		'Ou se calhar não é esta a matrícula, qualquer utilizador pode escrever o que quiser no formulário. Não é possível ter a certeza absoluta, mas pode ser, mas também pode não ser. Cada um tira as conclusões que quiser.',
		'Talvez essa não seja a matrícula correta, visto que qualquer pessoa pode inserir informações à vontade no formulário. Não se pode afirmar com total certeza, porém é uma possibilidade. Cabe a cada um interpretar como achar melhor.',
		'É possível que a matrícula mencionada não seja a verdadeira, considerando que o formulário permite que qualquer um digite o que desejar. Embora não haja garantia absoluta, pode ser que seja. A conclusão fica a critério de cada indivíduo.',
		'Pode ser que a matrícula indicada não seja exata, já que o formulário é aberto à livre inserção de dados por qualquer usuário. A certeza absoluta é inalcançável, mas existe a possibilidade. As conclusões dependem do julgamento pessoal de cada um.',
		'Alegadamente! Tudo alegadamente até porque é impossível saber com certeza absoluta porque a matrícula está desfocada. E qualquer utilizador é livre de introduzir o que quiser no formulário. Cada um tira as conclusões que quiser.',
		'É possível que não seja esta a matrícula, uma vez que qualquer pessoa pode inserir informações à vontade no formulário. Não é possível ter certeza absoluta, mas pode ser, mas também pode não ser. Cada um tira as conclusões que quiser.',
		'Ou se calhar não é esta a matrícula, qualquer utilizador pode escrever o que quiser no formulário. Não é possível ter a certeza absoluta, mas pode ser, mas também pode não ser. Cada um tira as conclusões que quiser.',
		'Ou talvez não, se calhar não é. Alegadamente é, mas não há certeza absoluta. Cada um tira as conclusões que quiser tendo em conta que qualquer utilizador pode escrever o que quiser no formulário.',
		'Ou se calhar não é esta a matrícula, qualquer utilizador pode escrever o que quiser no formulário. Não é possível ter a certeza absoluta, mas pode ser, mas também pode não ser. Cada um tira as conclusões que quiser.'
	];

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

	const formattedPlate = formatPlate(data.plate?.country || '', data.plate?.number || '');
	onMount(() => {
		if (!data.reports || data.reports.length === 0) {
			return;
		}

		let day = moment(data.reports[0].createdAt).format('D');
		if (day.length > 1) {
			day = day[day.length - 1];
		}

		const dayNumber = parseInt(day);
		disclaimerMsg = msgs[dayNumber];
	});
</script>

<svelte:head>
	{#if data.plate}
		<title>Imbecis :: {data.plate?.number}</title>
		<meta
			name="description"
			content={`O proprietário do veículo com a matrícula ${data.plate.number} é alegadamente um imbecil.`}
		/>
		<meta property="og:title" content={`Imbecis :: ${data.plate?.number}`} />
		<meta
			property="og:description"
			content={`O proprietário do veículo com a matrícula ${data.plate.number} é alegadamente um imbecil.`}
		/>
	{:else}
		<title>Imbecis :: Matrícula</title>
		<meta property="og:title" content={`Imbecis :: Matrículas`} />
	{/if}
	{#if data.reports && data.reports.length > 0}
		<meta property="og:image" content={data.reports[0].picture} />
	{/if}
</svelte:head>

<Content>
	{#if data.reports && data.reports.length > 0 && data.plate}
		<div>
			<Heading tag="h1" class="text-xxl mb-2">{formattedPlate} é alegadamente imbecil</Heading>
			<P class="mb-5 text-justify">
				O proprietário da viatura com a matrícula {formattedPlate} é <b>alegadamente</b> um imbecil,
				já estacionou abusivamente pelo menos
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
		<div class="mb-3">
			<Heading tag="h2" class="mb-5">Nota Importante</Heading>
			<P class="text-justify">
				{disclaimerMsg}
				Resumindo, é impossível ter a certeza e provar que as fotografias coorespondem realmente à legenda
				inserida por utilizadores anonimos na internet. Esta legenda provém de um campo de texto livre
				onde os utilizadores podem escrever o que bem entenderem, como um comentário numa rede social.
				E a imagem foi irreversivelmente desfocada antes de ser publicada como no Google Maps.</P
			>
		</div>
		<div class="flex justify-center">
			<Button href="/sobre/mais">Ler mais</Button>
		</div>
	{:else}
		<Heading tag="h1" class="text-xxl mb-2">Estranho</Heading>
		<P class="text-justify">
			A Matrícula existe no sistema mas não há denuncias confirmadas. Isto pode ser um erro do
			sistema ou pode indicar que uma denuncia foi removida.
		</P>
	{/if}
</Content>
