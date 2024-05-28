<script lang="ts">
	import Camera from '$lib/components/Camera.svelte';
	import { createReport, uploadPicture } from '$lib/api';
	import { location } from '$lib/stores/location';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import { UndoOutline, ArrowRightToBracketOutline, InfoCircleSolid } from 'flowbite-svelte-icons';
	import Centro from '$lib/components/Centro.svelte';
	import { onMount } from 'svelte';
	import { showNotification } from '$lib/utils/notifications';
	import Content from '$lib/components/Content.svelte';
	import {
		Modal,
		Label,
		Input,
		Select,
		Toggle,
		Alert,
		Heading,
		P,
		Button,
		Textarea
	} from 'flowbite-svelte';
	import type { ReporterInfo } from '$lib/types';

	$: image = null as Blob | null;
	$: showLocationModal = false as boolean;
	$: isSubmitting = false as boolean;
	let sendReporterInfo = false;
	let coordinatesLastUpdate = null as Date | null;
	let setupModal = false;
	let witnessContactModal = false;
	let imageHash = '';
	const idTypes = [
		{ value: 'cc', name: 'Cartão de Cidadão' },
		{ value: 'passport', name: 'Passaporte' },
		{ value: 'residency', name: 'Atz. Residência' }
	];

	let hasReporterInfo = false;
	const reporterInfo: ReporterInfo = {
		name: '',
		idType: 'cc',
		idNumber: '',
		email: '',
		obs: ''
	};

	onMount(async () => {
		isSubmitting = false;
		setupModal = shouldShowSetupModal();
		loadReporterInfo();
	});

	const shouldAskForGeolocation = () => {
		if (!coordinatesLastUpdate) {
			return true;
		}

		const now = new Date();
		const diff = now.getTime() - coordinatesLastUpdate.getTime();
		const seconds = diff / 1000;

		return seconds > 20;
	};

	const handlePictureTaken = (event: CustomEvent<Blob>) => {
		image = event.detail;
		generateImageHash().then((hash) => {
			imageHash = hash;
		});
	};

	const clearImage = () => {
		image = null;
		imageHash = '';
	};

	const locationOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	const startSubmitting = async () => {
		isLoading.set(true);
		loadingMessage.set('A desfocar caras...');

		if (shouldAskForGeolocation()) {
			askForGeolocation();
		} else {
			console.log('Already have recent coordinates, submitting...');
			loadingMessage.set('Localização recente já em memória');
			submit();
		}
	};

	const askForGeolocation = async () => {
		loadingMessage.set('A obter localização');
		navigator.geolocation.getCurrentPosition(geoSuccess, getError, locationOptions);
	};

	const geoSuccess = (position: GeolocationPosition) => {
		loadingMessage.set('Localização obtida com sucesso');
		location.set({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
		coordinatesLastUpdate = new Date();

		submit();
	};

	const getError = async (error: GeolocationPositionError) => {
		loadingMessage.set('Erro a obter localização');
		await new Promise((r) => setTimeout(r, 2000));
		showLocationModal = true;
		isLoading.set(false);
		console.log(`Could not get geo location: ${error.code}, ${error.message}`);
	};

	const submit = async () => {
		console.log('A iniciar processo de submissão de imagem...');
		loadingMessage.set('A criar denúnica');
		isSubmitting = true;
		isLoading.set(true);

		if (!image) {
			showNotification('Imagem não encontrada ou corrompida, tente de novo', 'error');
			isSubmitting = false;
			isLoading.set(false);
			return;
		}

		if (!imageHash) {
			console.log('Image hash not generated, trying again now...');
			imageHash = await generateImageHash();
		}

		const newReportRes = await createReport(
			imageHash,
			reporterInfo,
			sendReporterInfo && hasReporterInfo
		);

		if (!newReportRes.success) {
			showNotification(`Erro. ${newReportRes.message}`, 'error');
			isSubmitting = false;
			isLoading.set(false);
			return;
		}

		reporterInfo.obs = '';
		loadingMessage.set('A enviar fotografia');
		const uploadResponse = await uploadPicture(newReportRes.reportId, image);
		if (uploadResponse.success) {
			showNotification('Denúncia enviada com sucesso', 'success');
			clearImage();
		} else {
                        alert(uploadResponse.message);
			showNotification(`Erro. ${uploadResponse.message}`, 'error');
			clearImage();
		}

		isSubmitting = false;
		isLoading.set(false);
	};

	const handleUnderstandClicked = () => {
		setupModal = false;
		localStorage.setItem('understandSetupAt', new Date().toISOString());
	};

	const shouldShowSetupModal = () => {
		const understandSetupAt = localStorage.getItem('understandSetupAt');
		if (!understandSetupAt) {
			return true;
		}

		const date = new Date(understandSetupAt);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = diff / 1000;

		// show every 2 days
		return seconds > 60 * 60 * 24 * 2;
	};

	const handleSaveInfoClicked = () => {
		if (reporterInfo.email === '' || reporterInfo.idNumber === '' || reporterInfo.name === '') {
			showNotification('Por favor preencha todos os campos', 'warning');
			return;
		}

		if (!hasReporterInfo) {
			showNotification(
				'Dados guardados na memória do seu dispositivo para facilitar envios futuros',
				'success'
			);
		}

		witnessContactModal = false;
		localStorage.setItem('reporterInfo', JSON.stringify(reporterInfo));
		hasReporterInfo = true;
		sendReporterInfo = true;
		startSubmitting();
	};

	const loadReporterInfo = () => {
		const reporterInfoStr = localStorage.getItem('reporterInfo');
		if (!reporterInfoStr) {
			hasReporterInfo = false;
			return;
		}

		hasReporterInfo = true;
		const parsed = JSON.parse(reporterInfoStr);
		reporterInfo.name = parsed.name || '';
		reporterInfo.idType = parsed.idType || 'cc';
		reporterInfo.idNumber = parsed.idNumber || '';
		reporterInfo.email = parsed.email || '';
	};

	const handleSendClicked = () => {
		if (sendReporterInfo) {
			console.log('Send Reporter Info enabled, confirm data...');
			witnessContactModal = true;
			return;
		}

		console.log('Send Reporter Info disabled, starting submission...');

		startSubmitting();
	};

	const generateImageHash = async () => {
		if (!image) {
			return '';
		}

		try {
			// Generate a SHA 256 Hash for the image
			const buffer = await image.arrayBuffer();
			const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

			return hashHex;
		} catch (error: any) {
			console.error('Error generating image hash: ', error);
			return '';
		}
	};
</script>

<svelte:head>
	<title>Imbecis :: Adicionar</title>
</svelte:head>

<Content>
	<div class="camera-wrapper">
		<div class="container max-w-md mx-auto p-4 mb-20">
			{#if image && !isSubmitting}
				<div>
					<img
						id="photo_preview"
						src={URL.createObjectURL(image)}
						alt="Imagem a ser submetida"
						class="rounded-lg"
					/>

					<div class="mt-3 w-full">
						<Alert border color="blue" class="w-full">
							<InfoCircleSolid slot="icon" class="w-5 h-5" />
							Certifique-se que a matrícula e a infração são visíveis.
						</Alert>
					</div>
					{#if !sendReporterInfo}
						<div class="mt-3 w-full">
							<Alert border color="yellow" class="w-full">
								<InfoCircleSolid slot="icon" class="w-5 h-5" />
								Denúncias sem identificação são muito provavelmente descartadas pelas autoridades.
							</Alert>
						</div>
					{/if}
					<div class="w-full mt-5 mb-4">
						<Label for="textarea-id" class="mb-2">Observações para as autoridades: (opcional)</Label
						>
						<Textarea
							maxlength="255"
							bind:value={reporterInfo.obs}
							id="textarea-id"
							placeholder="Outras informações relevantes a serem enviadas"
							rows="2"
							name="reporterObs"
						/>
					</div>
					<div class="">
						<Toggle bind:checked={sendReporterInfo}>Enviar identificação às autoridades?</Toggle>
					</div>

					<div class="flex justify-center items-center mt-5">
						<div class="w-6/12 pr-1">
							<Button on:click={clearImage} type="button" color="red" class="w-full text-lg">
								<UndoOutline class="w-3.5 h-3.5 me-2" /> Tirar Outra
							</Button>
						</div>

						<div class="w-6/12 pl-1">
							<Button
								on:click={handleSendClicked}
								type="button"
								color="green"
								class="w-full text-lg"
							>
								Enviar <ArrowRightToBracketOutline class="w-3.5 h-3.5 ms-2" />
							</Button>
						</div>
					</div>
				</div>
			{/if}

			{#if !image}
				<Camera on:pictureTaken={handlePictureTaken}></Camera>
			{/if}
		</div>
	</div>
	<canvas id="canvas" class="display-none" width="1000" height="1000"></canvas>

	<Centro show={showLocationModal}>
		<div class="flex justify-center">
			<svg
				class="w-[100px] h-[100px] text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					fill-rule="evenodd"
					d="M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>

		<Heading tag="h2" class="mt-2 text-center mb-4">Localização</Heading>
		<P class="text-center mb-4"
			>Precisa de permitir a localização para poder enviar imbecis. A localização apenas é utilizada
			no momento do envio da fotografia e não é constantemente consumida ou guardada. Por favor
			permisa o uso da localização e volte a tentar novamente</P
		>

		<div class="flex justify-center">
			<Button
				on:click={() => {
					window.location.reload();
				}}
				color="light"
				class="mb-2">Voltar</Button
			>
		</div>
	</Centro>

	<Modal
		bind:open={setupModal}
		outsideclose={false}
		title="Antes de Denunciar, lembre-se:"
		class="z-60"
	>
		<div class="text-left">
			<ul class="mb-5 mt-1.5 ms-4 list-disc list-inside">
				<li>Apenas 1 Viatura por denúncia</li>
				<li>Certifique-se de que a matrícula e infração são visíveis antes de enviar</li>
				<li>Tire a fotografia e envie no local da infração, são guardadas coordenadas GPS</li>
				<li>Apenas denuncie viaturas em claro incumprimento do código da estrada</li>
				<li>
					Evite enviar pequenas infrações, como por exemplo carros ligeiramente fora dos limites num
					parque de estacionamento
				</li>
			</ul>
			<p class="text-sm">
				<b>Nota Temporária:</b> As denuncias confirmadas vão passar a ser comunicadas às autoridades
				automaticamente em breve, e as coordenadas GPS são importantes tanto para decidir para onde encaminhar
				como fazer prova. Denuncias anteriores nunca serão enviadas.
			</p>
			<Button class="mt-8 w-full" color="green" on:click={() => handleUnderstandClicked()}
				>Entendi</Button
			>
		</div>
	</Modal>

	<Modal
		class="z-60"
		style="z-index: 100"
		title="Dados do Denunciante"
		bind:open={witnessContactModal}
		autoclose={false}
		outsideclose={false}
	>
		<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
			{#if hasReporterInfo}
				Por favor <b>confirme</b> os seus dados antes de enviar a denúncia, será comunicada às autoridades.
			{:else}
				Para denunciar às autoridades terá de adicionar os seus dados pessoais, caso contrário esta
				será muito provavelmente descartada pelas mesmas.
			{/if}
		</p>

		<form class="flex flex-col space-y-6" action="#">
			<Label class="space-y-1">
				<span>Nome</span>
				<Input
					type="text"
					name="name"
					placeholder="O seu nome"
					required
					bind:value={reporterInfo.name}
				/>
			</Label>
			<div class="grid gap-3 mb-6 grid-cols-2">
				<div>
					<Label class="space-y-1">
						<span>Tipo de Identificação</span>
						<Select class="mt-2" items={idTypes} bind:value={reporterInfo.idType} />
					</Label>
				</div>

				<div>
					<Label class="space-y-1">
						<span>Nº de Identificação</span>
						<Input
							type="text"
							name="idNumber"
							placeholder="Número"
							required
							bind:value={reporterInfo.idNumber}
						/>
					</Label>
				</div>
			</div>

			<Label>
				<span>Email</span>
				<Input
					type="email"
					name="email"
					placeholder="O seu email"
					required
					bind:value={reporterInfo.email}
				/>
			</Label>

			{#if !hasReporterInfo}
				<p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400 p-1">
					Estes dados são armazenados localmente no seu dispositivo, e apenas vão junto com a
					denúncia até que o email para as autoridades seja enviado, sendo apagados imediatamente
					depois. Pode sempre confirmar e rever as informações sempre antes do envio de todas as
					denúncias.
				</p>
			{/if}

			<Button type="submit" class="w-full1" on:click={() => handleSaveInfoClicked()}
				>Confirmar e Enviar</Button
			>
		</form>
	</Modal>
</Content>

<style>
	.camera-wrapper {
		width: 100%;
		top: 0;
		left: 0;
	}
</style>
