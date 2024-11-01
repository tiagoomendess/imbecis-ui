<script lang="ts">
    import HeatMap from '$lib/components/HeatMap.svelte';
    import type { HeatCoordinate } from '$lib/types';
  
    export let data: { coordinates: HeatCoordinate[] };
</script>

<HeatMap coordinates={data.coordinates}/>
