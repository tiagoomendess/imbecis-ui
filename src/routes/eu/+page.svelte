<script lang="ts">
	import { goto } from '$app/navigation';
	import Content from '$lib/components/Content.svelte';
	import { Heading, P, A, PaginationItem } from 'flowbite-svelte';
	import {
		MapPinOutline,
		CalendarMonthOutline,
		ClockOutline,
		CameraPhotoOutline,
		CirclePlusOutline,
		FingerprintOutline
	} from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	import { getDeviceUUID } from '$lib/api';

	export let data: PageData;

	const deviceUUID = getDeviceUUID();

	const formatDate = (iso: string): string => {
		return new Date(iso).toLocaleDateString('pt-PT');
	};

	const formatTime = (iso: string): string => {
		return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
	};

	const translateStatus = (status: string): string => {
		switch (status) {
			case 'new':
				return 'A Aguardar Fotografia';
			case 'fill_geo_info':
				return 'A Obter Localização';
			case 'review':
				return 'Em Votação';
			case 'confirmed_manual_verify':
				return 'Revisão Manual';
			case 'confirmed_blur_plates':
				return 'A Esconder Matrícula';
			case 'notify':
				return 'A Notificar';
			case 'confirmed':
				return 'Confirmada';
			case 'rejected':
				return 'Rejeitada';
			default:
				return status;
		}
	};

	const statusBadgeClasses = (status: string): string => {
		switch (status) {
			case 'new':
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
			case 'fill_geo_info':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'review':
				return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
			case 'confirmed_manual_verify':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
			case 'confirmed_blur_plates':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			case 'confirmed':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'notify':
				return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200';
			case 'rejected':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const previous = async () => {
		if (data.page > 1) {
			const url = new URL(window.location.href);
			url.searchParams.set('page', (data.page - 1).toString());
			await goto(url, { replaceState: true });
		}
	};

	const next = async () => {
		if (data.page < data.totalPages) {
			const url = new URL(window.location.href);
			url.searchParams.set('page', (data.page + 1).toString());
			await goto(url, { replaceState: true });
		}
	};
</script>

<svelte:head>
	<title>Imbecis :: O Meu Perfil</title>
</svelte:head>

<Content>
	<Heading class="mb-5">O Meu Perfil</Heading>

	{#if deviceUUID}
		<div class="mb-6 flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
			<FingerprintOutline class="h-5 w-5 shrink-0 text-gray-400" />
			<div class="min-w-0">
				<p class="text-xs text-gray-500 dark:text-gray-400">ID do dispositivo</p>
				<p class="truncate font-mono text-xs text-gray-700 dark:text-gray-200">{deviceUUID}</p>
			</div>
		</div>
	{/if}

	{#if data.noDevice}
		<div class="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
			<CameraPhotoOutline class="mx-auto mb-3 h-10 w-10 text-gray-400" />
			<p class="mb-1 font-medium text-gray-700 dark:text-gray-200">Nenhuma denúncia encontrada</p>
			<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
				Este dispositivo ainda não enviou nenhuma denúncia.
			</p>
			<A href="/adicionar" class="inline-flex items-center gap-1 text-sm font-medium">
				<CirclePlusOutline class="h-4 w-4" />
				Adicionar a primeira
			</A>
		</div>
	{:else if data.total === 0}
		<div class="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
			<CameraPhotoOutline class="mx-auto mb-3 h-10 w-10 text-gray-400" />
			<p class="mb-1 font-medium text-gray-700 dark:text-gray-200">Sem denúncias ainda</p>
			<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
				Ainda não enviou nenhuma denúncia neste dispositivo.
			</p>
			<A href="/adicionar" class="inline-flex items-center gap-1 text-sm font-medium">
				<CirclePlusOutline class="h-4 w-4" />
				Adicionar a primeira
			</A>
		</div>
	{:else}
		<div class="mb-4">
			<P size="sm" class="text-gray-500 dark:text-gray-400">
				{data.total} {data.total === 1 ? 'denúncia' : 'denúncias'} · Página {data.page} de {data.totalPages}
			</P>
		</div>

		<div class="mb-5">
			{#each data.reports as report (report.id)}
				<article
					class="mb-3 flex items-center gap-4 bg-gray-50 p-4 shadow-md dark:bg-gray-800 dark:shadow-black/40"
					style="border-radius: 1.25rem"
				>
					<!-- Fixed-size square image -->
					<div class="h-28 w-28 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-700" style="border-radius: 1rem">
						{#if report.picture}
							<img
								src={report.picture}
								alt="Denúncia"
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center text-gray-400">
								<CameraPhotoOutline class="h-10 w-10" />
							</div>
						{/if}
					</div>

					<!-- Info panel -->
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<span
							class="w-fit rounded-full px-3 py-1 text-sm font-medium {statusBadgeClasses(report.status)}"
						>
							{translateStatus(report.status)}
						</span>

						<div class="flex min-w-0 items-center gap-1.5 text-gray-700 dark:text-gray-200">
							<MapPinOutline class="h-4 w-4 shrink-0 text-gray-400" />
							<span class="truncate">{report.municipality ?? 'Localização desconhecida'}</span>
						</div>

						<div class="flex flex-wrap items-center gap-y-1 text-gray-500 dark:text-gray-400">
							<div class="flex items-center gap-1.5">
								<CalendarMonthOutline class="h-4 w-4 shrink-0" />
								<span>{formatDate(report.occurredAt)}</span>
							</div>
							<div class="ml-4 flex items-center gap-1.5">
								<ClockOutline class="h-4 w-4 shrink-0" />
								<span>{formatTime(report.occurredAt)}</span>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<div class="flex space-x-3 rtl:space-x-reverse justify-center">
			{#if data.page > 1}
				<PaginationItem onclick={previous}>Anterior</PaginationItem>
			{/if}
			{#if data.page < data.totalPages}
				<PaginationItem onclick={next}>Próxima</PaginationItem>
			{/if}
		</div>
	{/if}
</Content>
