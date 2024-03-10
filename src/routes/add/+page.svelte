<script lang="ts">
	import Camera from '$lib/Camera.svelte';
	import { createReport, uploadPicture } from '$lib/api';
	import Notification from '$lib/Notification.svelte';
	import { location } from '$lib/stores/location';
    import { isLoading } from '$lib/stores/loading';

	$: image = null as Blob | null;
	$: showLocationModal = false as boolean;
	$: isSubmitting = false as boolean;
	$: reportSentNotification = false as boolean;
	$: errorSendingReportNotification = false as boolean;

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

	const askForGeolocation = async () => {
        isLoading.set(true);
		navigator.geolocation.getCurrentPosition(geoSuccess, getError, locationOptions);
	};

	const geoSuccess = (position: GeolocationPosition) => {
		location.set({
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});

		submit();
	};

	const getError = (error: GeolocationPositionError) => {
		showLocationModal = true;
		console.log(`Could not get geo location: ${error.code}, ${error.message}`);
	};

	const submit = async () => {
		console.log('A iniciar processo de submissão de imagem...');
		isSubmitting = true;

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
			<div class="flex justify-center items-center mt-5">
				<button
					on:click={clearImage}
					type="button"
					class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
				>
					Tirar Outra
				</button>
				<button
					on:click={askForGeolocation}
					type="button"
					class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
				>
					Enviar
				</button>
			</div>
		</div>
	{/if}

	{#if !image}
		<Camera on:pictureTaken={handlePictureTaken}></Camera>
	{/if}
    </div>
</div>

<style>
    .camera-wrapper {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        min-height: 100%;
    }
</style>
