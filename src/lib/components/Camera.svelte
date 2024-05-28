<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { CameraFotoOutline } from 'flowbite-svelte-icons';
	import { Alert, Button } from 'flowbite-svelte';
	import { showNotification } from '../utils/notifications';

	onMount(async () => {
		askCameraPermissions();
	});

	onDestroy(() => {
		stopCamera();
	});

	const dispatch = createEventDispatcher();
	let videoElement: HTMLVideoElement;
	let stream: MediaStream | null = null;
	$: hasCameraPermissions = false;

	let zoomEnabled = false;
	let zoomLevel = 1;
	let minZoom = 1;
	let maxZoom = 3;
	let zoomStep = 0.1;

	let brightnessEnabled = false;
	let brightnessLevel = 1;
	let minBrightness = 0;
	let maxBrightness = 2;
	let brightnessStep = 0.1;

	let videoTrack: MediaStreamTrack | null = null;
	let supportedConstraints: MediaTrackSupportedConstraints | null = null;
	let settings: MediaTrackSettings | null = null;

	const checkCameraCapabilities = async (): Promise<void> => {
		return new Promise((resolve) => {
			if (!videoTrack) {
				return;
			}

			const capabilities = videoTrack.getCapabilities() as any;

			// Check if zoom is supported
			if ('zoom' in capabilities) {
				zoomEnabled = true;
				minZoom = capabilities.zoom.min;
				maxZoom = capabilities.zoom.max;
				zoomStep = capabilities.zoom.step;
				zoomLevel = 1;
			} else {
				// Zoom is not supported
				console.warn('Zoom is not supported');
				showNotification('Zoom não está disponível', 'warning');
			}

			if ('brightness' in capabilities) {
				brightnessEnabled = true;
				minBrightness = capabilities.brightness.min;
				maxBrightness = capabilities.brightness.max;
				brightnessStep = capabilities.brightness.step;
				brightnessLevel = 1;
			} else {
				console.warn('Brightness is not supported');
			}

			resolve();
		});
	};

	const updateConstraints = () => {
		if (!videoTrack) {
			return;
		}

		try {
			videoTrack.applyConstraints({ advanced: [{ zoom: zoomLevel } as any] });
		} catch (error) {
			console.log('Error updating constraints: ', error);
			showNotification('Não foi possível aplicar zoom', 'error');
		}

		try {
			videoTrack.applyConstraints({ advanced: [{ brightness: brightnessLevel } as any] });
		} catch (error) {
			console.log('Error updating constraints: ', error);
			showNotification('Não foi possível aplicar brilho', 'error');
		}
	};

	const getConstraints = () => {
		const constraints = {
			video: {
				zoom: true,
				facingMode: 'environment'
			},
			audio: false
		} as any;

		if (!supportedConstraints) {
			return constraints;
		}

		if (supportedConstraints.aspectRatio) {
			constraints.video.aspectRatio = { ideal: 1 };
		}

		return constraints;
	};

	const askCameraPermissions = async () => {
		try {
			supportedConstraints = await navigator.mediaDevices.getSupportedConstraints();

			stream = await navigator.mediaDevices.getUserMedia(getConstraints());

			videoElement.srcObject = stream;
			videoTrack = stream.getVideoTracks()[0];
			settings = videoTrack.getSettings();
			await checkCameraCapabilities();
			updateConstraints();

			hasCameraPermissions = true;
		} catch (err) {
			// ... handle error ...
			hasCameraPermissions = false;
			console.error('Error accessing the camera: ', err);
		}

		try {
			const panTiltZoomPermissionStatus = await navigator.permissions.query({
				name: 'camera',
				panTiltZoom: true
			} as any);

			if (panTiltZoomPermissionStatus.state == 'granted') {
				// User has granted access to the website to control camera PTZ.
				console.log('User has granted access to the website to control camera PTZ.');
			}

			panTiltZoomPermissionStatus.addEventListener('change', () => {
				// User has changed PTZ permission status.
				console.log('User has changed PTZ permission status.');
			});
		} catch (error) {
			console.log('Ask for zoom error: ', error);
		}
	};

	const takePicture = () => {
		const canvas = document.createElement('canvas');
		canvas.width = videoElement.videoWidth;
		canvas.height = videoElement.videoHeight;
		const context = canvas.getContext('2d');
		context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

		// Convert the canvas to a Blob
		canvas.toBlob((blob) => {
			if (!blob) {
				return;
			}
			dispatch('pictureTaken', blob);
		}, 'image/webp', 0.80);
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
	};
</script>

<div>
	{#if hasCameraPermissions == false}
		<Alert color="blue">Por favor, dá permissões para utilizar a câmara</Alert>
	{/if}

	<video bind:this={videoElement} autoplay playsinline>
		<track kind="captions" />
	</video>

	<div class="flex justify-center items-center mt-3 mb-10">
		<Button on:click={takePicture} color="dark" size="xl" class="hover:bg-gray-600 w-full"
			>&nbsp;<CameraFotoOutline />&nbsp;</Button
		>
	</div>

	<div class="flex justify-center">
		{#if zoomEnabled}
			<input
				class="mr-2 slider"
				type="range"
				min={minZoom}
				max={maxZoom}
				step="0.1"
				bind:value={zoomLevel}
				on:change={updateConstraints}
				disabled={!zoomEnabled}
			/>
		{/if}

		{#if brightnessEnabled}
			<input
				class="ml-2 slider"
				type="range"
				min={minBrightness}
				max={maxBrightness}
				step={brightnessStep}
				bind:value={brightnessLevel}
				on:change={updateConstraints}
			/>
		{/if}
	</div>
</div>

<style>
	video {
		width: 100%;
		height: auto;
		border-radius: 10px;
	}

	.slider {
		width: 100%;
	}
</style>
