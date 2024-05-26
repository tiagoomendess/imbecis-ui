<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Heading, Button } from 'flowbite-svelte';
	import { updateReportPicture } from '$lib/api';
	import { showNotification } from '$lib/utils/notifications';
	import { isLoading, loadingMessage } from '$lib/stores/loading';
	import Content from '$lib/components/Content.svelte';

	export const ssr = false;
	export let data: PageData;
	let originalCanvas: HTMLCanvasElement;
	let originalContext: CanvasRenderingContext2D;
	let previewCanvas: HTMLCanvasElement;
	let previewContext: CanvasRenderingContext2D;
	let offscreenCanvas: HTMLCanvasElement;
	let offscreenContext: CanvasRenderingContext2D;
	let points = [] as any[];

	$: canSave = false;
	$: canBlur = false;
	$: canReset = false;

	onMount(() => {
		if (previewCanvas) {
			previewContext = previewCanvas.getContext('2d') as CanvasRenderingContext2D;
			offscreenCanvas = document.createElement('canvas') as HTMLCanvasElement;
			offscreenContext = offscreenCanvas.getContext('2d') as CanvasRenderingContext2D;
			originalCanvas = document.createElement('canvas') as HTMLCanvasElement;
			originalContext = originalCanvas.getContext('2d') as CanvasRenderingContext2D;
			loadImage();
		}
	});

	async function loadImage() {
		const image = new Image();
		image.crossOrigin = 'anonymous';
		image.src = data.report?.pictureSignedUrl as string;
		image.onload = () => {
			previewCanvas.width = image.width;
			previewCanvas.height = image.height;
			previewContext.drawImage(image, 0, 0);

			offscreenCanvas.width = image.width;
			offscreenCanvas.height = image.height;
			offscreenContext.drawImage(image, 0, 0);

			originalCanvas.width = image.width;
			originalCanvas.height = image.height;
			originalContext.drawImage(image, 0, 0);
		};
	}

	function addPoint(event: MouseEvent) {
		if (points.length > 0) {
			canReset = true;
		}
		if (points.length >= 3) {
			canBlur = true;
		}

		if (points.length < 10) {
			const rect = previewCanvas.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			// assuming pics are always square
			const factor = offscreenCanvas.width / previewCanvas.clientWidth;
			x = x * factor;
			y = y * factor;

			points.push({ x, y });
			drawPoints();
		}
	}

	function drawPoints() {
		previewContext.drawImage(offscreenCanvas, 0, 0); // Redraw the preview from offscreen canvas

		// Draw the points
		points.forEach((point) => {
			previewContext.beginPath();
			previewContext.arc(point.x, point.y, 5, 0, 2 * Math.PI);
			previewContext.fillStyle = 'red';
			previewContext.fill();
		});
	}

	function applyBlur() {
		if (points.length < 3) {
			return;
		}

		// Begin a new path for the polygon
		offscreenContext.beginPath();

		// Move to the first point
		offscreenContext.moveTo(points[0].x, points[0].y);

		// Draw lines to each point
		for (let i = 1; i < points.length; i++) {
			offscreenContext.lineTo(points[i].x, points[i].y);
		}

		// Close the path to form a polygon
		offscreenContext.closePath();

		// Clip to the polygon path
		offscreenContext.save();
		offscreenContext.clip();

		// Draw the original image
		offscreenContext.drawImage(previewCanvas, 0, 0);

		// Apply the blur filter
		offscreenContext.filter = 'blur(15px)';

		// Redraw the image over itself to apply the blur only within the clipped region
		offscreenContext.drawImage(offscreenCanvas, 0, 0);

		// Restore the context to remove the clipping effect
		offscreenContext.restore();

		// Draw the final image on the preview canvas
		previewContext.drawImage(offscreenCanvas, 0, 0);

		canSave = true;
	}

	function handleBlur() {
		applyBlur();
	}

	function reset() {
		canSave = false;
		canBlur = false;
		canReset = false;
		points = [];
		previewContext.drawImage(originalCanvas, 0, 0);
		offscreenContext.drawImage(originalCanvas, 0, 0);
	}

	async function save() {
		isLoading.set(true);
		loadingMessage.set('A guardar imagem');
		const dataURL = previewCanvas.toDataURL('image/webp');
		const blob = dataURLToBlob(dataURL);

		const response = await updateReportPicture(data.report?.id as string, blob);
		if (response.success) {
			loadingMessage.set('A carregar imagem editada...');
			showNotification('Imagem guardada com sucesso', 'success');
			reset();
			location.reload();
		} else {
			showNotification(response.message, 'error');
			isLoading.set(false);
		}
	}

	function dataURLToBlob(dataURL: string) {
		const byteString = atob(dataURL.split(',')[1]);
		const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: mimeString });
	}
</script>

<Content>
	<div>
		<Heading class="mb-5">Report</Heading>
		<canvas bind:this={previewCanvas} class="rounded-lg aspect-square w-full" on:click={addPoint}
		></canvas>

		<div class="mt-5 flex justify-center">
			<Button disabled={!canBlur} color="blue" class="m-1" on:click={handleBlur}>Blur</Button>
			<Button disabled={!canReset} color="red" class="m-1" on:click={reset}>Reset</Button>
			<Button disabled={!canSave} color="green" class="m-1" on:click={save}>Guardar</Button>
		</div>

		<div class="mt-2">
			<p class="text-center text-xs">Apenas dispositivos autorizados conseguem editar a imagem</p>
		</div>
	</div>
</Content>
