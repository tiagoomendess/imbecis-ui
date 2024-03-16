<script lang="ts">
	import { Spinner, Img, P } from 'flowbite-svelte';
	import { isLoading } from '$lib/stores/loading';
	import { loadingMessage as loadingMessageStore } from '$lib/stores/loading';

	$: loadingMessage = ""
	loadingMessageStore.subscribe((value) => {
		loadingMessage = value;
	});

	$: show = false as boolean;
	isLoading.subscribe((value) => {
		show = value;
		if (!value) {
			loadingMessage = "";
		}
	});
</script>

{#if show}
	<div class="loader">
		<div class="flex justify-center items-center flex-col container max-w-md mx-auto p-4 mb-20">
			<Img src="/imbecis_logo_300.png" class="mb-4 w-5/12" />
			{#if loadingMessage != ''}
				<P class="text-center mb-5">
					{loadingMessage}
				</P>
			{/if}
			<Spinner color="primary" size="10" />
		</div>
	</div>
{/if}

<style>
	.loader {
		position: fixed;
		z-index: 49;
		width: 100%;
		height: calc(100% - 64px);
		background: rgb(249, 249, 249);
		background: radial-gradient(circle, rgb(245, 245, 245) 0%, rgba(191, 191, 191, 1) 100%);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
