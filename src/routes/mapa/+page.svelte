<script lang="ts">
	import HeatMap from '$lib/components/HeatMap.svelte';
	import type { HeatCoordinate } from '$lib/types';
	import { globalMapView } from '$lib/stores/mapView';

	export let data: { coordinates: HeatCoordinate[] };

	const GLOBAL_MAP_URL = 'https://canales.github.io/illegal-parking-portugal/';
</script>

{#if $globalMapView}
	<iframe
		src={GLOBAL_MAP_URL}
		title="Mapa global de estacionamento ilegal em Portugal"
		class="global-frame"
		allowfullscreen
	></iframe>
{:else}
	<HeatMap coordinates={data.coordinates} />
{/if}

<style>
	.global-frame {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		border: none;
		z-index: 1;
		padding-top: 40px;
	}
</style>
