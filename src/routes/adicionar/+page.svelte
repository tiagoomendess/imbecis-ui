<script lang="ts">
	import Camera from '$lib/Camera.svelte';
	import { createReport, uploadPicture } from '$lib/api';
	import Notification from '$lib/Notification.svelte';
	import { location } from '$lib/stores/location';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import { Heading, P, Button } from 'flowbite-svelte';
	import { UndoOutline, ArrowRightToBracketOutline } from 'flowbite-svelte-icons';
	import Centro from '$lib/Centro.svelte';

	$: image = null as Blob | null;
	$: showLocationModal = false as boolean;
	$: isSubmitting = false as boolean;
	$: reportSentNotification = false as boolean;
	$: errorSendingReportNotification = false as boolean;

	let coordinatesLastUpdate = null as Date | null;

	const shouldAskForGeolocation = () => {
		if (!coordinatesLastUpdate) {
			return true;
		}

		const now = new Date();
		const diff = now.getTime() - coordinatesLastUpdate.getTime();
		const seconds = diff / 1000;

		return seconds > 60;
	};

	const showReportSentNotification = () => {
		reportSentNotification = true;
		setTimeout(() => {
			reportSentNotification = false;
		}, 5000);
	};

	const showErrorSendingReportNotification = () => {
		errorSendingReportNotification = true;
		setTimeout(() => {
			errorSendingReportNotification = false;
		}, 5000);
	};

	const handlePictureTaken = (event: CustomEvent<Blob>) => {
		console.log('Imagem capturada handlePictureTaken');
		image = event.detail;
	};

	const clearImage = () => {
		image = null;
	};

	const locationOptions = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	const startSubmitting = () => {
		loadingMessage.set('A carregar');
		isLoading.set(true);
		if (shouldAskForGeolocation()) {
			askForGeolocation();
		} else {
			console.log("Already have recent coordinates, submitting...")
			loadingMessage.set('Localização recente já em memória');
			submit();
		}
	}

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
		await new Promise(r => setTimeout(r, 2000));
		showLocationModal = true;
		isLoading.set(false);
		console.log(`Could not get geo location: ${error.code}, ${error.message}`);
	};

	const submit = async () => {
		console.log('A iniciar processo de submissão de imagem...');
		loadingMessage.set('A criar denúnica');
		isSubmitting = true;
		isLoading.set(true);

		const newReportId = await createReport();
		if (!newReportId) {
			isSubmitting = false;
			isLoading.set(false);
			return;
		}

		if (!image) {
			isSubmitting = false;
			isLoading.set(false);
			return;
		}

		loadingMessage.set('A enviar fotografia');
		const uploaded = await uploadPicture(newReportId, image);

		if (uploaded) {
			showReportSentNotification();
			clearImage();
		} else {
			showErrorSendingReportNotification();
			clearImage();
		}

		isSubmitting = false;
		isLoading.set(false);
	};
</script>

{#if reportSentNotification || true}
	<Notification type="success" show={reportSentNotification}>
		Fotografia enviada com sucesso
	</Notification>
{/if}

{#if errorSendingReportNotification}
	<Notification type="error" show={errorSendingReportNotification}>
		Erro a enviar fotografia
	</Notification>
{/if}

<div class="camera-wrapper">
	<div class="container max-w-md mx-auto p-4 mb-20">
		{#if image && !isSubmitting}
			<div>
				<img src={URL.createObjectURL(image)} alt="Imagem a ser submetida" class="rounded-lg" />

				<div class="flex justify center mt-3">
					<P size="xs" class="text-center w-full"
						>Certifique-se que a matrícula é visivel sem zoom</P
					>
				</div>

				<div class="flex justify-center items-center mt-5">
					<div class="w-6/12 pr-1">
						<Button on:click={clearImage} type="button" color="red" class="w-full">
							<UndoOutline class="w-3.5 h-3.5 me-2" /> Tirar Outra
						</Button>
					</div>

					<div class="w-6/12 pl-1">
						<Button on:click={startSubmitting} type="button" color="green" class="w-full">
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

<style>
	.camera-wrapper {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		min-height: 100%;
	}
</style>
