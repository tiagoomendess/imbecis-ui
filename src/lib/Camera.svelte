<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { CameraFotoOutline } from 'flowbite-svelte-icons';
	import { Alert } from 'flowbite-svelte';

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

	const askCameraPermissions = async () => {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
			videoElement.srcObject = stream;
			hasCameraPermissions = true;
		} catch (err) {
			// Do nothing
			hasCameraPermissions = false;
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
			askCameraPermissions();
		}, 'image/png');
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

	<video bind:this={videoElement} autoplay>
		<track kind="captions" />
	</video>

	<div class="flex justify-center items-center mt-3">
		<button
			on:click={takePicture}
			type="button"
			class="text-white bg-gray-800 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
		>
			<CameraFotoOutline />
		</button>
	</div>
</div>

<style>
	video {
		width: 100%;
		height: auto;
		border-radius: 10px;
	}
</style>
