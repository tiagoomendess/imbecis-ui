<script lang="ts">
	export let show = true;
</script>

{#if show}
	<div class="centro pt-10 pl-10 pr-10 pb-18">
		<slot />
	</div>
{/if}

<style>
	.centro {
		position: fixed;
		top: 0;
		left: 0;
		min-height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
        flex-direction: column;
		background-color: white;
		z-index: 15;
	}
</style>
