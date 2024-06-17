<script lang="ts">
	import Content from '$lib/components/Content.svelte';
	import {
		Heading,
		Button,
		Img,
		Accordion,
		AccordionItem,
		Table,
		PaginationItem,
		Label,
		Select,
		Modal,
		Input
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { deleteReport, updateReport, type ReportInList, type ReportInListUpdateRequest } from '$lib/reportsApi';
	import { goto } from '$app/navigation';
	import Country from '$lib/components/Country.svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let data: PageData;
	let showEditModal = false;
	let showDeleteReportConfirmModal = false;
	let reportBeingEdited: ReportInList | null;

	let editable = {
		plateCountry: '',
		plateNumber: '',
		status: ''
	};

	const sortOrder = [
		{ value: 'asc', name: 'Ascending' },
		{ value: 'desc', name: 'Descending' }
	];

	const statuses = [
		{ value: 'new', name: 'New' },
		{ value: 'fill_geo_info', name: 'Fill Geo Info' },
		{ value: 'review', name: 'Review' },
		{ value: 'confirmed_manual_verify', name: 'Confirmed Manual Verify' },
		{ value: 'notify', name: 'Notify' },
		{ value: 'confirmed_blur_plates', name: 'Confirmed Blur Plates' },
		{ value: 'confirmed', name: 'Confirmed' },
		{ value: 'rejected', name: 'Rejected' },
		{ value: 'removed', name: 'Removed' }
	];

	const translateStatus = (state: string) => {
		switch (state) {
			case 'new':
				return 'New';
			case 'review':
				return 'Review';
			case 'notify':
				return 'Notify';
			case 'confirmed':
				return 'Confirmed';
			case 'rejected':
				return 'Rejected';
			case 'confirmed_blur_plates':
				return 'Confirmed Blur Plates';
			case 'fill_geo_info':
				return 'Fill Geo Info';
			case 'removed':
				return 'Removed';
			case 'confirmed_manual_verify':
				return 'Confirmed Manual Verify';
			default:
				return state;
		}
	};

	const formatDate = (date: string | Date) => {
		if (typeof date === 'string') {
			date = new Date(date);
		}

		return date.toLocaleDateString('pt-PT');
	};

	const formatTime = (date: string | Date) => {
		if (typeof date === 'string') {
			date = new Date(date);
		}

		return date.toLocaleTimeString('pt-PT');
	};

	const getPlatePreview = (report: ReportInList) => {
		if (!report.confirmedPlate && !report.suggestedPlate) return '-';

		const plate = report.confirmedPlate || report.suggestedPlate;
		const extra = report.confirmedPlate ? ' ✅' : ' ⚠️';

		return `${plate?.country} ${plate?.number} ${extra}`;
	};

	const previous = async () => {
		if (data.page > 1) {
			const url = new URL(window.location.href);
			url.searchParams.set('page', (data.page - 1).toString());

			await goto(url, { replaceState: true });
		}
	};

	const next = async () => {
		if (data.page < Math.ceil(data.total / 10)) {
			const url = new URL(window.location.href);
			url.searchParams.set('page', (data.page + 1).toString());

			await goto(url, { replaceState: true });
		}
	};

	const applyFilter = async () => {
		const url = new URL(window.location.href);
		if (data.filters.status === '') {
			url.searchParams.delete('status');
		} else {
			url.searchParams.set('status', data.filters.status);
		}

		url.searchParams.set('sortOrder', data.filters.sortOrder);
		await goto(url, { replaceState: true });
	};

	const resetFilter = async () => {
		const url = new URL(window.location.href);
		data.filters.status = '';
		data.filters.sortOrder = '';
		data.page = 1;
		url.searchParams.delete('status');
		url.searchParams.delete('sortOrder');
		url.searchParams.delete('page');

		await goto(url, { replaceState: true });
	};

	const editClick = (reportId: string) => {
		reportBeingEdited = data.reports.find((r) => r.id === reportId) || null;
		if (!reportBeingEdited) {
			return;
		}

		editable.plateCountry = 'pt';
		editable.plateNumber = '';
		if (reportBeingEdited.suggestedPlate) {
			editable.plateCountry = reportBeingEdited?.suggestedPlate?.country || 'pt';
			editable.plateNumber = reportBeingEdited?.suggestedPlate?.number || '';
		}

		if (reportBeingEdited.confirmedPlate) {
			editable.plateCountry = reportBeingEdited?.confirmedPlate?.country || 'pt';
			editable.plateNumber = reportBeingEdited?.confirmedPlate?.number || '';
		}

		editable.status = reportBeingEdited?.status || '';
		showEditModal = true;
	};

	const deleteReportClicked = async (confirmed: boolean) => {
		if (!confirmed) {
			showDeleteReportConfirmModal = true;
			return;
		}

		const success = await deleteReport(reportBeingEdited?.id || '');
		if (success) {
			console.log('Report deleted successfully', success);
			window.location.reload();
		}
	};

	const saveClicked = async () => {
		if (!reportBeingEdited) return;

		const request = {
			reportId: reportBeingEdited.id,
			status: editable.status
		} as ReportInListUpdateRequest;

		if (editable.plateNumber && editable.plateNumber !== '') {
			editable.plateNumber = normalizePlateNumber(editable.plateNumber);
			request.plateCountry = editable.plateCountry;
			request.plateNumber = editable.plateNumber;
		}

		// send request to api
		const success = await updateReport(request);
		if (success) {
			if (editable.plateNumber && editable.plateNumber) {
				reportBeingEdited.confirmedPlate = {
					country: editable.plateCountry,
					number: editable.plateNumber
				};
			}

			reportBeingEdited.status = editable.status;

			// Replace the report in the list
			for (let i = 0; i < data.reports.length; i++) {
				if (data.reports[i].id === reportBeingEdited.id) {
					data.reports[i] = reportBeingEdited;
					break;
				}
			}
			showEditModal = false;
		}

		// Reset editable fields
		editable.plateCountry = '';
		editable.plateNumber = '';
		editable.status = '';
	};

	const getTextColorForStatus = (status: string): string => {
		switch (status) {
			case 'new':
				return 'text-blue-500';
			case 'review':
				return 'text-blue-500';
			case 'notify':
				return 'text-lime-500';
			case 'confirmed':
				return 'text-green-500';
			case 'rejected':
				return 'text-red-500';
			case 'confirmed_blur_plates':
				return 'text-green-500';
			case 'fill_geo_info':
				return 'text-purple-500';
			case 'removed':
				return 'text-red-500';
			default:
				return 'text-black';
		}
	};

	const normalizePlateNumber = (plateNumber: string) => {
		return plateNumber
			.trim()
			.replace(/[\s\-]+/g, '')
			.toUpperCase();
	};
</script>

<svelte:head>
	<title>Imbecis App :: Reports List</title>
</svelte:head>

<Content>
	<Heading class="mb-7">Reports List</Heading>

	<Accordion flush class="mb-2">
		<AccordionItem>
			<span slot="header">Filtrar</span>

			<div class="grid grid-cols-2 gap-2 mb-3">
				<Label>
					Status
					<Select
						placeholder="Escolhe um Status"
						class="mt-2"
						items={statuses}
						bind:value={data.filters.status}
					/>
				</Label>
				<Label>
					Order
					<Select class="mt-2" items={sortOrder} bind:value={data.filters.sortOrder} />
				</Label>
			</div>

			<div class="flex">
				<div class="w-1/3">
					<Button on:click={resetFilter} color="light" class="w-full">Reset</Button>
				</div>

				<div class="w-2/3 ml-3">
					<Button on:click={applyFilter} color="blue" class="w-full">Aplicar Filtro</Button>
				</div>
			</div>
		</AccordionItem>
	</Accordion>

	<div class="w-full mb-5">
		<small
			>Showing {data.total} items, in page {data.page} of {Math.ceil(data.total / 10) || 1}</small
		>
	</div>

	<div class="w-full">
		{#each data.reports as report}
			<div class="report-item">
				<div class="w-full grid grid-cols-2 gap-2">
					<div>
						<Img src={report.publicPicture} alt={report.id} class="image" />
					</div>
					<div>
						<Table class="mb-2">
							<tr>
								<td><b>Status</b></td>
								<td class={getTextColorForStatus(report.status)}
									>{translateStatus(report.status)}</td
								>
							</tr>
							<tr>
								<td><b>Dia</b></td>
								<td>{formatDate(report.createdAt)}</td>
							</tr>
							<tr>
								<td><b>Hora</b></td>
								<td>{formatTime(report.createdAt)}</td>
							</tr>
							<tr>
								<td><b>Município</b></td>
								<td>{report.municipality || 'Desconhecido'}</td>
							</tr>
							<tr>
								<td><b>Matrícula</b></td>
								<td>{getPlatePreview(report)}</td>
							</tr>
							<tr>
								<td><b>Votos:</b></td>
								<td
									>{report.imbecileVotes + report.notSureVotes} ({report.imbecileVotes}/{report.notSureVotes})</td
								>
							</tr>
						</Table>
						<Button on:click={() => editClick(report.id)} color="light" class="w-full"
							>Editar</Button
						>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="flex space-x-3 rtl:space-x-reverse justify-center">
		{#if data.page > 1}
			<PaginationItem on:click={previous} large>Anterior</PaginationItem>
		{/if}

		{#if data.page < Math.ceil(data.total / 10)}
			<PaginationItem on:click={next} large>Próxima</PaginationItem>
		{/if}
	</div>

	<Modal title={`Editar ${reportBeingEdited?.id}`} bind:open={showEditModal} autoclose outsideclose>
		<div>
			<div class="">
				<div class="mb-2 grid grid-cols-2 gap-2">
					<Img
						style="width: 100%"
						class=""
						src={reportBeingEdited?.originalPicture || reportBeingEdited?.publicPicture}
					/>
					<Img
						style="width: 100%"
						class=""
						src={reportBeingEdited?.publicPicture || reportBeingEdited?.publicPicture}
					/>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div class="flex">
						<!-- Matricula 🇵🇹 -->
						<div class="w-2/12">
							<Country bind:value={editable.plateCountry} />
						</div>
						<div class="w-10/12 pl-2">
							<Label for="plate_input" class="block mb-2 text-center">Matrícula</Label>
							<Input
								bind:value={editable.plateNumber}
								class="text-center uppercase text-lg"
								id="plate_input"
								placeholder="AA 00 AA"
								autofocus
							/>
						</div>
					</div>
					<div>
						<Label class="text-center">
							Status
							<Select
								placeholder="Escolhe um Status"
								class="mt-2 text-lg"
								items={statuses}
								bind:value={editable.status}
							/>
						</Label>
					</div>
				</div>
			</div>
		</div>
		<svelte:fragment slot="footer">
			<Button on:click={() => saveClicked()}>Guardar</Button>
			{#if reportBeingEdited?.status === 'rejected' || reportBeingEdited?.status === 'removed'}
				<Button on:click={() => deleteReportClicked(false)} color="red">Apagar</Button>
			{/if}
			<Button color="alternative">Cancelar</Button>
		</svelte:fragment>
	</Modal>

	<Modal bind:open={showDeleteReportConfirmModal} size="xs" autoclose>
		<div class="text-center">
			<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
			<h3 class="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">Apagar Denúncia?</h3>
			<p class="mb-7">
				Denúncia com o id <b>{reportBeingEdited?.id}</b> vai ser apagada permanentemente e esta ação
				não pode ser revertida!
			</p>
			<Button on:click={() => deleteReportClicked(true)} color="red" class="me-2"
				>Sim, Apagar</Button
			>
			<Button color="alternative">Não, Cancelar</Button>
		</div>
	</Modal>
</Content>

<style>
	.image {
		width: 100%;
	}

	.report-item {
		width: 100%;
		padding-bottom: 1rem;
	}
</style>
