<script lang="ts">
	import Content from '$lib/components/Content.svelte';
	import Map from '$lib/components/Map.svelte';

</script>

<Content fullWidth={true}>
	<div class="main-view">
		<Map />
	</div>
</Content>

<style>
	.main-view {
		width: 100%;
		height: calc(100vh - 64px);
		z-index: 1;
		overflow: hidden;
	}
</style>
