<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import L from 'leaflet';
	import 'leaflet.heat';
	import { onMount, onDestroy } from 'svelte';
	import type { HeatCoordinate } from '../types';

	import { Label } from 'flowbite-svelte';
	import { Range } from 'flowbite-svelte';

	export let coordinates: HeatCoordinate[];

	let map: L.Map;
	let heatLayer: L.HeatLayer;

	// Reactive variables for heatmap settings
	let radius = 12;
	let blur = 16;
	let maxZoom = 17;

	let currentMapZoom = 7;

	onMount(() => {
		// Initialize the map with restricted zoom levels
		map = L.map('map', {
			center: [39.8284, -9.175],
			zoom: currentMapZoom,
			minZoom: 7,
			maxZoom: 16
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
		<Label>Max Zoom {maxZoom}</Label>
		<Range id="range-steps" min="5" max="40" bind:value={maxZoom} step="1" />

		<Label>Blur {blur}</Label>
		<Range id="range-steps" min="5" max="40" bind:value={blur} step="1" />

		<Label>Radius {radius}</Label>
		<Range id="range-steps" min="5" max="40" bind:value={radius} step="1" />
	</form>
</div>

<style>
	#map {
		height: 100vh;
		width: 100%;
		z-index: 1;
	}
	.controls {
		position: absolute;
		top: 10px;
		left: 55px;
		z-index: 3;
		background-color: rgba(255, 255, 255, 0.7);
		border-radius: 10px;
		padding: 15px;
	}
</style>
