<script lang="ts">
	import { Spinner, Img } from 'flowbite-svelte';
	import { isLoading } from '$lib/stores/loading';

	$: show = false as boolean;
	isLoading.subscribe((value) => {
		show = value;
	});
</script>

{#if show}
	<div class="loader">
		<div class="text-center">
			<Img src="/imbecis_logo_300.png" class="mb-4" />
			<Spinner color="primary" size=10 />
		</div>
	</div>
{/if}

<style>
	.loader {
		position: fixed;
		z-index: 49;
		width: 100%;
		height: 100%;
		background: rgb(249, 249, 249);
		background: radial-gradient(circle, rgb(245, 245, 245) 0%, rgba(191, 191, 191, 1) 100%);
	}

	.loader > div {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		width: 100px;
		height: 100px;
		z-index: 2000;
	}
</style>
