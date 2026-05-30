<script lang="ts">
	import 'leaflet/dist/leaflet.css';
	import L from 'leaflet';
	import { onMount, onDestroy } from 'svelte';

	export let latitude: number;
	export let longitude: number;
	export let interactive: boolean = true;
	export let onMove: (lat: number, lng: number) => void = () => {};

	let mapEl: HTMLElement;
	let map: L.Map | undefined;
	let marker: L.Marker | undefined;

	// Fix Leaflet marker icon paths broken by Vite bundling
	function fixLeafletIcons() {
		// @ts-ignore
		delete L.Icon.Default.prototype._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
			iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
			shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
		});
	}

	onMount(() => {
		fixLeafletIcons();

		map = L.map(mapEl, {
			center: [latitude, longitude],
			zoom: 16,
			zoomControl: true
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19
		}).addTo(map);

		marker = L.marker([latitude, longitude], { draggable: interactive }).addTo(map);

		marker.on('dragend', () => {
			if (!marker) return;
			const latlng = marker.getLatLng();
			onMove(latlng.lat, latlng.lng);
		});
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
		marker = undefined;
	});

	// Reactively enable/disable dragging when `interactive` prop changes
	$: if (marker) {
		if (interactive) {
			marker.dragging?.enable();
		} else {
			marker.dragging?.disable();
		}
	}
</script>

<div style="position: relative; z-index: 1;">
	<div bind:this={mapEl} style="height: 260px; width: 100%; border-radius: 0.75rem; overflow: hidden;"></div>
</div>
