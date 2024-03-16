<script lang="ts">
	export let show = true;
</script>

{#if show}
	<div class="centro">
		<div class="w-full">
			<div class="container max-w-md mx-auto p-4 mb-20">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.centro {
		position: fixed;
		top: 0;
		left: 0;
		height: calc(100% - 64px);
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background-color: white;
		z-index: 15;
	}
</style>
