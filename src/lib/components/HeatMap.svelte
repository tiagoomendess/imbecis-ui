<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import L from 'leaflet';
	import 'leaflet.heat';
	import { onMount, onDestroy } from 'svelte';
	import type { HeatCoordinate } from '../types';

	import { Range } from 'flowbite-svelte';

	export let coordinates: HeatCoordinate[];

	let map: L.Map;
	let heatLayer: L.HeatLayer;

	// Reactive variables for heatmap settings
	let radius = 10;
	let blur = 15;
	let maxZoom = 15;

	let currentMapZoom = 7;

	onMount(() => {
		// Initialize the map with restricted zoom levels
		map = L.map('map', {
			center: [39.8284, -9.175],
			zoom: currentMapZoom,
			minZoom: 7,
			maxZoom: 17
		});

		// Set up the base tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		// Initialize heat layer with initial settings
		heatLayer = L.heatLayer([], {
			radius,
			blur,
			maxZoom,
			gradient: {
				0.4: 'blue',
				0.5: 'cyan',
				0.6: 'lime',
				0.7: 'yellow',
				0.8: 'orange',
				0.9: 'red'
			}
		}).addTo(map);

		// Add zoomend event listener
		map.on('zoomend', () => {
			const currentZoom = map.getZoom();
			adjustHeatmapOptions(currentZoom);
		});
	});

	// Update heat layer data whenever coordinates change
	$: if (heatLayer && coordinates.length) {
		heatLayer.setLatLngs(
			coordinates.map(({ latitude, longitude, intensity = 1 }) => [
				latitude,
				longitude,
				intensity
			])
		);
	}

	// Update heat layer settings when radius, blur, or maxZoom change
	$: if (heatLayer) {
		heatLayer.setOptions({ radius, blur, maxZoom });
	}

	onDestroy(() => {
		if (map) map.remove();
	});

	const adjustHeatmapOptions = (zoom: number) => {
		let newRadius = (radius * 100);
		let newBlur = (blur * 100);
		let newMaxZoom = (maxZoom * 100);

		// Update heat layer with new options
		if (heatLayer) {
			heatLayer.setOptions({ newRadius, newBlur, newMaxZoom });
		}
	};
</script>

<!-- Map container -->
<div id="map"></div>

<!-- Settings form -->
<div class="controls">
	<form>
		<label for="heatmap-max-zoom">Max Zoom {maxZoom}</label>
		<Range id="heatmap-max-zoom" min="5" max="40" bind:value={maxZoom} step="1" />

		<label for="heatmap-blur">Blur {blur}</label>
		<Range id="heatmap-blur" min="5" max="40" bind:value={blur} step="1" />

		<label for="heatmap-radius">Radius {radius}</label>
		<Range id="heatmap-radius" min="5" max="40" bind:value={radius} step="1" />
	</form>
</div>

<style>
	#map {
		height: 100vh;
		width: 100%;
		z-index: 1;
	}
	.controls {
		position: fixed;
		top: 54px;
		left: 55px;
		z-index: 3;
		padding: 14px 16px;
		border-radius: 12px;
		border: 1px solid rgb(229 231 235);
		background-color: rgba(255, 255, 255, 0.92);
		color: rgb(17 24 39);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(4px);
	}
	.controls form {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.controls label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: rgb(17 24 39);
	}
	:global(.dark) .controls {
		border-color: rgb(55 65 81);
		background-color: rgba(31, 41, 55, 0.92);
		color: rgb(243 244 246);
	}
	:global(.dark) .controls label {
		color: rgb(243 244 246);
	}

	.controls :global(input[type='range']) {
		appearance: none;
		-webkit-appearance: none;
		width: 100%;
		height: 6px;
		background: rgb(229 231 235);
		border-radius: 9999px;
		outline: none;
		cursor: pointer;
	}
	:global(.dark) .controls :global(input[type='range']) {
		background: rgb(55 65 81);
	}
	.controls :global(input[type='range']::-webkit-slider-thumb) {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: rgb(37 99 235);
		border: 2px solid white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}
	.controls :global(input[type='range']::-moz-range-thumb) {
		width: 16px;
		height: 16px;
		border-radius: 9999px;
		background: rgb(37 99 235);
		border: 2px solid white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}
	:global(.dark) .controls :global(input[type='range']::-webkit-slider-thumb) {
		border-color: rgb(31 41 55);
	}
	:global(.dark) .controls :global(input[type='range']::-moz-range-thumb) {
		border-color: rgb(31 41 55);
	}
</style>
