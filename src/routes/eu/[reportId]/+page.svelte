<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Content from '$lib/components/Content.svelte';
	import PinMap from '$lib/components/PinMap.svelte';
	import {
		Heading,
		Label,
		Input,
		Select,
		Button,
		Alert,
		Spinner,
		Toggle
	} from 'flowbite-svelte';
	import {
		AngleLeftOutline,
		MapPinOutline,
		CalendarMonthOutline,
		ClockOutline,
		CameraPhotoOutline,
		DownloadOutline,
		CheckCircleOutline,
		ExclamationCircleOutline,
		InfoCircleOutline,
		LockOutline,
		EyeOutline,
		CloseOutline,
		PlusOutline,
		MinusOutline
	} from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	import type { ReportDetail, PatchReportPayload } from '$lib/api';
	import { getMyReportDetail, updateMyReport } from '$lib/api';
	import { showNotification } from '$lib/utils/notifications';

	export let data: PageData;

	let detail: ReportDetail = data.detail;

	// --- Local form state ---
	let municipality = detail.municipality ?? '';
	let municipalitySearch = detail.municipality ?? '';
	let showMunicipalityList = false;
	let highlightedIndex = -1;
	let rua = detail.geoInfo?.rua ?? '';
	let n_porta: string = detail.geoInfo?.n_porta != null ? String(detail.geoInfo.n_porta) : '';
	let CP = detail.geoInfo?.CP ?? '';
	let freguesia = detail.geoInfo?.freguesia ?? '';

	let plateCountry = detail.plate?.country ?? 'pt';
	let plateNumber = detail.plate?.number ?? '';

	// Location dirty tracking
	let locationDirty = false;
	let newLat = detail.location.latitude;
	let newLng = detail.location.longitude;

	// UI state
	let isSaving = false;
	let isPolling = false;
	let csrfErrorVisible = false;
	let lockReport = false;

	// Sync form fields from new detail (after save / poll)
	function syncFromDetail(d: ReportDetail) {
		municipality = d.municipality ?? '';
		municipalitySearch = d.municipality ?? '';
		showMunicipalityList = false;
		highlightedIndex = -1;
		rua = d.geoInfo?.rua ?? '';
		n_porta = d.geoInfo?.n_porta != null ? String(d.geoInfo.n_porta) : '';
		CP = d.geoInfo?.CP ?? '';
		freguesia = d.geoInfo?.freguesia ?? '';
		plateCountry = d.plate?.country ?? plateCountry;
		plateNumber = d.plate?.number ?? '';
		newLat = d.location.latitude;
		newLng = d.location.longitude;
		locationDirty = false;
		lockReport = false;
	}

	// --- Plate country options ---
	const plateCountries = [
		{ value: 'pt', name: '🇵🇹 Portugal (PT)' },
		{ value: 'es', name: '🇪🇸 Espanha (ES)' },
		{ value: 'fr', name: '🇫🇷 França (FR)' },
		{ value: 'it', name: '🇮🇹 Itália (IT)' },
		{ value: 'de', name: '🇩🇪 Alemanha (DE)' },
		{ value: 'gb', name: '🇬🇧 Reino Unido (GB)' },
		{ value: 'ch', name: '🇨🇭 Suíça (CH)' },
		{ value: 'nl', name: '🇳🇱 Holanda (NL)' },
		{ value: 'lu', name: '🇱🇺 Luxemburgo (LU)' },
		{ value: 'ad', name: '🇦🇩 Andorra (AD)' },
		{ value: 'dk', name: '🇩🇰 Dinamarca (DK)' },
		{ value: 'be', name: '🇧🇪 Bélgica (BE)' }
	];

	// --- Municipality autocomplete ---
	const normalize = (s: string): string =>
		s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

	$: filteredMunicipalities = (() => {
		const q = normalize(municipalitySearch);
		if (!q) return detail.validMunicipalities;
		return detail.validMunicipalities.filter((m) => normalize(m).includes(q));
	})();

	function selectMunicipality(m: string) {
		municipality = m;
		municipalitySearch = m;
		showMunicipalityList = false;
		highlightedIndex = -1;
	}

	function onMunicipalityInput() {
		showMunicipalityList = true;
		highlightedIndex = -1;
		// Commit only when the typed text exactly matches a valid municipality
		if (detail.validMunicipalities.includes(municipalitySearch)) {
			municipality = municipalitySearch;
		}
	}

	function onMunicipalityBlur() {
		// Revert the search box to the last committed (valid) municipality
		if (!detail.validMunicipalities.includes(municipalitySearch)) {
			municipalitySearch = municipality;
		}
		showMunicipalityList = false;
		highlightedIndex = -1;
	}

	function onMunicipalityKeydown(e: KeyboardEvent) {
		if (!showMunicipalityList && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
			showMunicipalityList = true;
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			highlightedIndex = Math.min(highlightedIndex + 1, filteredMunicipalities.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightedIndex = Math.max(highlightedIndex - 1, 0);
		} else if (e.key === 'Enter') {
			if (showMunicipalityList && highlightedIndex >= 0 && filteredMunicipalities[highlightedIndex]) {
				e.preventDefault();
				selectMunicipality(filteredMunicipalities[highlightedIndex]);
			}
		} else if (e.key === 'Escape') {
			showMunicipalityList = false;
			highlightedIndex = -1;
		}
	}

	// Whether address fields are editable right now
	$: addressDisabled = !detail.editable || locationDirty || isPolling;

	// A report can be locked (advanced past voting) only when every required
	// piece of information is present: address, picture and a plate.
	$: hasPlate = !!detail.plate || plateNumber.trim() !== '';
	$: canLock =
		detail.editable &&
		!isPolling &&
		!locationDirty &&
		municipality.trim() !== '' &&
		rua.trim() !== '' &&
		CP.trim() !== '' &&
		freguesia.trim() !== '' &&
		!!detail.picture &&
		hasPlate;

	// Never keep the lock toggle active if the conditions stop being met
	$: if (!canLock && lockReport) lockReport = false;

	// --- Status helpers ---
	const translateStatus = (status: string): string => {
		switch (status) {
			case 'new': return 'A Aguardar Fotografia';
			case 'fill_geo_info': return 'A Obter Localização';
			case 'review': return 'Em Votação';
			case 'confirmed_manual_verify': return 'Revisão Manual';
			case 'confirmed_blur_plates': return 'A Esconder Matrícula';
			case 'notify': return 'A Notificar';
			case 'confirmed': return 'Confirmada';
			case 'rejected': return 'Rejeitada';
			case 'generate_pdf': return 'A Gerar PDF';
			default: return status;
		}
	};

	const statusBadgeClasses = (status: string): string => {
		switch (status) {
			case 'new': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
			case 'fill_geo_info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'review': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
			case 'confirmed_manual_verify': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
			case 'confirmed_blur_plates': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'notify': return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200';
			case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			case 'generate_pdf': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
		}
	};

	const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('pt-PT');
	const formatTime = (iso: string): string =>
		new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

	// --- Pin moved ---
	function handlePinMove(lat: number, lng: number) {
		newLat = lat;
		newLng = lng;
		locationDirty = true;
	}

	// --- Polling after location update ---
	let pollInterval: ReturnType<typeof setInterval> | undefined;

	function startPolling() {
		isPolling = true;
		pollInterval = setInterval(async () => {
			const fresh = await getMyReportDetail(detail.id);
			if (fresh && fresh.status === 'review') {
				detail = fresh;
				syncFromDetail(fresh);
				isPolling = false;
				clearInterval(pollInterval);
				showNotification('Localização processada com sucesso', 'success');
			}
		}, 3000);
	}

	onDestroy(() => {
		if (pollInterval) clearInterval(pollInterval);
	});

	// If the page loads while status is already fill_geo_info, start polling immediately
	if (detail.status === 'fill_geo_info') {
		startPolling();
	}

	// --- Download PDF ---
	const downloadPdf = async () => {
		if (!detail.pdf) return;
		try {
			const response = await fetch(detail.pdf);
			if (!response.ok) { showNotification('Erro ao descarregar o PDF', 'error'); return; }
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `denuncia-${detail.id}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			showNotification('Erro ao descarregar o PDF', 'error');
		}
	};

	// --- Save ---
	async function save() {
		isSaving = true;
		csrfErrorVisible = false;

		const payload: PatchReportPayload = {};

		if (locationDirty) {
			payload.location = { latitude: newLat, longitude: newLng };
		} else {
			// Only include changed address fields
			if (municipality !== (detail.municipality ?? '')) payload.municipality = municipality;
			if (rua !== (detail.geoInfo?.rua ?? '')) payload.rua = rua;

			const currentNPorta = detail.geoInfo?.n_porta != null ? String(detail.geoInfo.n_porta) : '';
			if (n_porta !== currentNPorta) {
				payload.n_porta = n_porta.trim() === '' ? null : parseInt(n_porta, 10);
			}

			if (CP !== (detail.geoInfo?.CP ?? '')) payload.CP = CP;
			if (freguesia !== (detail.geoInfo?.freguesia ?? '')) payload.freguesia = freguesia;
		}

		// Include plate if number was entered
		if (plateNumber.trim()) {
			payload.plateCountry = plateCountry;
			payload.plateNumber = plateNumber.trim().toUpperCase();
		}

		// Request advancing the report past the voting process
		if (lockReport && canLock) {
			payload.lock_report = true;
		}

		if (Object.keys(payload).length === 0) {
			showNotification('Nenhuma alteração para guardar', 'warning');
			isSaving = false;
			return;
		}

		const result = await updateMyReport(detail.id, payload);

		if (result.csrfExpired) {
			csrfErrorVisible = true;
			showNotification(
				result.error ?? 'O código de segurança expirou. Atualize a página e tente novamente.',
				'error'
			);
			isSaving = false;
			return;
		}

		if (!result.detail) {
			showNotification(result.error ?? 'Erro ao guardar alterações', 'error');
			isSaving = false;
			return;
		}

		const wasLockRequest = payload.lock_report === true;

		detail = result.detail;
		syncFromDetail(result.detail);
		showNotification(
			wasLockRequest ? 'Denúncia finalizada com sucesso' : 'Alterações guardadas com sucesso',
			'success'
		);

		if (detail.status === 'fill_geo_info') {
			startPolling();
		}

		isSaving = false;
	}

	// --- Image viewer (lightbox) ---
	let imageViewerOpen = false;
	let imageZoom = 1;
	const MIN_ZOOM = 0.5;
	const MAX_ZOOM = 4;
	const ZOOM_STEP = 0.25;

	function openImageViewer() {
		imageZoom = 1;
		imageViewerOpen = true;
	}

	function closeImageViewer() {
		imageViewerOpen = false;
	}

	function zoomIn() {
		imageZoom = Math.min(imageZoom + ZOOM_STEP, MAX_ZOOM);
	}

	function zoomOut() {
		imageZoom = Math.max(imageZoom - ZOOM_STEP, MIN_ZOOM);
	}

	function onViewerKeydown(e: KeyboardEvent) {
		if (!imageViewerOpen) return;
		if (e.key === 'Escape') closeImageViewer();
		else if (e.key === '+' || e.key === '=') zoomIn();
		else if (e.key === '-') zoomOut();
	}
</script>

<svelte:window onkeydown={onViewerKeydown} />

<svelte:head>
	<title>Imbecis :: Detalhes da Denúncia</title>
</svelte:head>

<Content>
	<!-- Back button -->
	<button
		type="button"
		onclick={() => goto('/eu')}
		class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
	>
		<AngleLeftOutline class="h-4 w-4" />
		As minhas denúncias
	</button>

	<Heading tag="h2" class="mb-5 text-xl">Detalhes da Denúncia</Heading>

	<!-- A. Header -->
	<section class="mb-5 overflow-hidden rounded-2xl bg-gray-50 shadow-md dark:bg-gray-800 dark:shadow-black/40">
		{#if detail.picture}
			<div class="relative">
				<img
					src={detail.picture}
					alt="Foto da denúncia"
					class="h-52 w-full object-cover"
				/>
				<button
					type="button"
					aria-label="Ver imagem ampliada"
					onclick={openImageViewer}
					class="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
				>
					<EyeOutline class="h-5 w-5" />
				</button>
			</div>
		{:else}
			<div class="flex h-40 w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
				<CameraPhotoOutline class="h-14 w-14 text-gray-400" />
			</div>
		{/if}

		<div class="flex flex-col gap-3 p-4">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<span class="w-fit rounded-full px-3 py-1 text-sm font-medium {statusBadgeClasses(detail.status)}">
					{translateStatus(detail.status)}
				</span>

				{#if detail.pdf}
					<Button size="xs" color="alternative" onclick={downloadPdf}>
						<DownloadOutline class="me-1.5 h-3.5 w-3.5" /> Download PDF
					</Button>
				{/if}
			</div>

			<dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<div>
					<dt class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
						<CalendarMonthOutline class="h-3.5 w-3.5" /> Ocorrência
					</dt>
					<dd class="text-gray-700 dark:text-gray-200">
						{formatDate(detail.occurredAt)} às {formatTime(detail.occurredAt)}
					</dd>
				</div>
				<div>
					<dt class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
						<CalendarMonthOutline class="h-3.5 w-3.5" /> Submetida
					</dt>
					<dd class="text-gray-700 dark:text-gray-200">
						{formatDate(detail.createdAt)} às {formatTime(detail.createdAt)}
					</dd>
				</div>
				{#if detail.municipality}
					<div class="col-span-2">
						<dt class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
							<MapPinOutline class="h-3.5 w-3.5" /> Município
						</dt>
						<dd class="text-gray-700 dark:text-gray-200">{detail.municipality}</dd>
					</div>
				{/if}
			</dl>
		</div>
	</section>

	<!-- B. Editability / status notices -->
	{#if isPolling}
		<Alert color="blue" class="mb-4">
			<Spinner size="4" class="me-2 inline" />
			<span>A localização está a ser processada. Aguarde um momento...</span>
		</Alert>
	{:else if !detail.editable}
		<Alert color="yellow" class="mb-4">
			<ExclamationCircleOutline slot="icon" class="h-4 w-4" />
			A edição só está disponível enquanto a denúncia está em estado <strong>Em Votação</strong>.
		</Alert>
	{/if}

	{#if csrfErrorVisible}
		<Alert color="red" class="mb-4" dismissable>
			<ExclamationCircleOutline slot="icon" class="h-4 w-4" />
			O código de segurança expirou. Submeta ou avalie uma denúncia para obter um novo código e tente novamente.
		</Alert>
	{/if}

	<!-- C. Location -->
	<section class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
		<h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
			<MapPinOutline class="h-4 w-4 text-gray-400" />
			Localização
		</h3>

		<PinMap
			latitude={detail.location.latitude}
			longitude={detail.location.longitude}
			interactive={detail.editable && !isPolling}
			onMove={handlePinMove}
		/>

		<p class="mt-2 text-xs text-gray-400">
			{newLat.toFixed(6)}, {newLng.toFixed(6)}
		</p>

		{#if locationDirty}
			<Alert color="blue" class="mt-3">
				<InfoCircleOutline slot="icon" class="h-4 w-4" />
				A localização foi alterada. Depois de guardar, os dados de morada serão preenchidos automaticamente pelo sistema. Os campos de morada estão desativados até esse processo terminar.
			</Alert>
		{/if}
	</section>

	<!-- D. Address fields -->
	<section class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
		<h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Morada</h3>

		{#if detail.geoInfo === null && !isPolling}
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Os dados de morada ainda não estão disponíveis para esta denúncia.
			</p>
		{:else}
			<div class="flex flex-col gap-4">
				<Label class="space-y-1">
					<span>Município <span class="text-red-500">*</span></span>
					<div class="relative">
						<Input
							type="text"
							placeholder="Escreva para procurar..."
							autocomplete="off"
							bind:value={municipalitySearch}
							disabled={addressDisabled}
							oninput={onMunicipalityInput}
							onfocus={() => (showMunicipalityList = true)}
							onblur={onMunicipalityBlur}
							onkeydown={onMunicipalityKeydown}
						/>
						{#if showMunicipalityList && !addressDisabled && filteredMunicipalities.length > 0}
							<ul
								class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-700"
								role="listbox"
							>
								{#each filteredMunicipalities.slice(0, 50) as m, i (m)}
									<li role="option" aria-selected={m === municipality}>
										<button
											type="button"
											class="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 {i === highlightedIndex ? 'bg-gray-100 dark:bg-gray-600' : ''}"
											onmousedown={(e) => {
												e.preventDefault();
												selectMunicipality(m);
											}}
										>
											{m}
										</button>
									</li>
								{/each}
							</ul>
						{:else if showMunicipalityList && !addressDisabled && municipalitySearch.trim() !== ''}
							<div
								class="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 shadow-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400"
							>
								Nenhum município encontrado
							</div>
						{/if}
					</div>
				</Label>

				<Label class="space-y-1">
					<span>Rua <span class="text-red-500">*</span></span>
					<Input
						type="text"
						placeholder="Nome da rua"
						bind:value={rua}
						disabled={addressDisabled}
						required
					/>
				</Label>

				<div class="grid grid-cols-2 gap-3">
					<Label class="space-y-1">
						<span>Nº de porta</span>
						<Input
							type="text"
							inputmode="numeric"
							pattern="[0-9]*"
							placeholder="Opcional"
							bind:value={n_porta}
							disabled={addressDisabled}
						/>
					</Label>

					<Label class="space-y-1">
						<span>Código Postal <span class="text-red-500">*</span></span>
						<Input
							type="text"
							placeholder="0000-000"
							bind:value={CP}
							disabled={addressDisabled}
							required
						/>
					</Label>
				</div>

				<Label class="space-y-1">
					<span>Freguesia <span class="text-red-500">*</span></span>
					<Input
						type="text"
						placeholder="Freguesia"
						bind:value={freguesia}
						disabled={addressDisabled}
						required
					/>
				</Label>
			</div>
		{/if}
	</section>

	<!-- E. Plate assignment -->
	<section class="mb-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
		<h3 class="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-200">Matrícula</h3>

		{#if detail.plate}
			<p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
				Matrícula atual: <strong class="font-mono uppercase">{detail.plate.country.toUpperCase()} · {detail.plate.number}</strong>
			</p>
		{/if}

		<p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
			{detail.plate
				? 'Alterar a matrícula sobrescreve a matrícula atual, incluindo a proposta pela comunidade.'
				: 'Pode atribuir a matrícula diretamente, sem passar pelo processo de votação da comunidade.'}
		</p>

		<div class="flex flex-col gap-4">
			<Label class="space-y-1">
				<span>País</span>
				<Select
					items={plateCountries}
					bind:value={plateCountry}
					disabled={!detail.editable || isPolling}
				/>
			</Label>

			<Label class="space-y-1">
				<span>Número de matrícula</span>
				<div class="flex items-center gap-2">
					<Input
						type="text"
						placeholder="Ex: AA0000"
						bind:value={plateNumber}
						disabled={!detail.editable || isPolling}
						oninput={() => { plateNumber = plateNumber.toUpperCase(); }}
					/>
					{#if detail.picture}
						<button
							type="button"
							aria-label="Ver imagem ampliada"
							onclick={openImageViewer}
							class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							<EyeOutline class="h-5 w-5" />
						</button>
					{/if}
				</div>
			</Label>
		</div>
	</section>

	<!-- Lock toggle + Save button -->
	{#if detail.editable && !isPolling}
		{#if canLock}
			<div class="mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
				<Toggle bind:checked={lockReport}>
					<span class="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
						<LockOutline class="h-4 w-4 text-gray-400" />
						Tudo está correto, trancar denúncia
					</span>
				</Toggle>
				<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
					Ao finalizar, a denúncia avança sem passar pelo processo de votação. Esta ação não pode ser revertida.
				</p>
			</div>
		{/if}

		<Button
			color="primary"
			class="w-full"
			disabled={isSaving}
			onclick={save}
		>
			{#if isSaving}
				<Spinner size="4" class="me-2" />
				A guardar...
			{:else if lockReport}
				<LockOutline class="me-2 h-4 w-4" />
				Finalizar Denúncia
			{:else}
				<CheckCircleOutline class="me-2 h-4 w-4" />
				Guardar alterações
			{/if}
		</Button>
	{/if}
</Content>

<!-- Image viewer / lightbox -->
{#if imageViewerOpen && detail.picture}
	<div class="fixed inset-0 z-[100] flex flex-col bg-black/90">
		<!-- Top controls -->
		<div class="flex items-center justify-end gap-2 p-3">
			<button
				type="button"
				aria-label="Reduzir"
				onclick={zoomOut}
				disabled={imageZoom <= MIN_ZOOM}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
			>
				<MinusOutline class="h-5 w-5" />
			</button>
			<span class="min-w-14 text-center text-sm font-medium text-white tabular-nums">
				{Math.round(imageZoom * 100)}%
			</span>
			<button
				type="button"
				aria-label="Ampliar"
				onclick={zoomIn}
				disabled={imageZoom >= MAX_ZOOM}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-40"
			>
				<PlusOutline class="h-5 w-5" />
			</button>
			<button
				type="button"
				aria-label="Fechar"
				onclick={closeImageViewer}
				class="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
			>
				<CloseOutline class="h-6 w-6" />
			</button>
		</div>

		<!-- Image area -->
		<div class="flex-1 overflow-auto p-4">
			<img
				src={detail.picture}
				alt="Foto da denúncia ampliada"
				style="width: {imageZoom * 100}%;"
				class="m-auto block h-auto max-w-none select-none transition-[width] duration-150"
				draggable="false"
			/>
		</div>
	</div>
{/if}
