<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { CameraFotoOutline } from 'flowbite-svelte-icons';
	import { Alert, Button } from 'flowbite-svelte';

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
	$: videoElementStyle = `filter: brightness(${brightnessLevel});`;

	let zoomLevel = 1;
	let brightnessLevel = 1;
	let videoTrack: MediaStreamTrack | null = null;
	let supportedConstraints: MediaTrackSupportedConstraints | null = null;
	let settings: MediaTrackSettings | null = null;

	const checkCameraCapabilities = () => {
		if (!videoTrack) {
			return;
		}

		const capabilities = videoTrack.getCapabilities();

		// Check if zoom is supported
		if ('zoom' in capabilities) {
			// Zoom is supported
			// You can adjust the range of your zoom slider based on capabilities.zoom
			console.log('Zoom is supported', capabilities.zoom);
		} else {
			// Zoom is not supported
			console.error('Zoom is not supported');
		}
	};

	const updateConstraints = () => {
		if (videoTrack) {
			console.log('zoom: ', zoomLevel, 'brightness: ', brightnessLevel);
			videoTrack.applyConstraints({
				advanced: [
					{
						brightness: brightnessLevel,
						zoom: zoomLevel
					}
				]
			});
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
			});

			if (panTiltZoomPermissionStatus.state == 'granted') {
				// User has granted access to the website to control camera PTZ.
				console.log('User has granted access to the website to control camera PTZ.');
			}

			panTiltZoomPermissionStatus.addEventListener('change', () => {
				// User has changed PTZ permission status.
				console.log('User has changed PTZ permission status.');
			});
		} catch (error) {
			console.log("Ask for zoom error: ", error);
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
		}, 'image/webp');
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

	<video bind:this={videoElement} autoplay playsinline style={videoElementStyle}>
		<track kind="captions" />
	</video>

	<div class="flex justify-center items-center mt-3 mb-10">
		<Button on:click={takePicture} color="dark" size="xl" class="hover:bg-gray-600">&nbsp;<CameraFotoOutline/>&nbsp;</Button>
	</div>

	<div class="flex justify-center">
		<input
			class="mr-2"
			type="range"
			min="1"
			max="3"
			step="0.1"
			bind:value={zoomLevel}
			on:change={updateConstraints}
		/>
		<input
			class="ml-2"
			type="range"
			min="0.5"
			max="1.5"
			step="0.1"
			bind:value={brightnessLevel}
			on:change={updateConstraints}
		/>
	</div>
	<div class="mt-5 text-center">
		<span class="text-center text-xs">zoom e brilho experimental, não funciona em todos os telemóveis</span>
	</div>
</div>

<style>
	video {
		width: 100%;
		height: auto;
		border-radius: 10px;
	}
</style>
