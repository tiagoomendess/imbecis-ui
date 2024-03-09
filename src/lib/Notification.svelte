<script lang="ts">
	import { Toast } from 'flowbite-svelte';
    import { fly } from 'svelte/transition';
	import {
		CheckCircleSolid,
		ExclamationCircleSolid,
		InfoCircleSolid,
		CloseSolid
	} from 'flowbite-svelte-icons';

	export let type = '' as 'info' | 'success' | 'warning' | 'error' | 'warn' | 'danger';
	export let clearAfter = 0;

	if (clearAfter > 0) {
		setTimeout(() => {
			show = false;
		}, clearAfter * 1000);
	}

	export let show = true;
</script>

{#if show}
	<div class="notification-wrapper mt-5">
		<div>
			{#if type === 'info'}
				<Toast transition={fly} params={{ y: -200 }} color="blue">
					<svelte:fragment slot="icon">
						<InfoCircleSolid class="w-5 h-5" />
						<span class="sr-only">Check icon</span>
					</svelte:fragment>
					<slot />
				</Toast>
			{:else if type === 'success'}
				<Toast transition={fly} params={{ y: -200 }} color="green">
					<svelte:fragment slot="icon">
						<CheckCircleSolid class="w-5 h-5" />
						<span class="sr-only">Check icon</span>
					</svelte:fragment>
					<slot />
				</Toast>
			{:else if type === 'warning' || type === 'warn'}
				<Toast transition={fly} params={{ y: -200 }} color="orange">
					<svelte:fragment slot="icon">
						<ExclamationCircleSolid class="w-5 h-5" />
						<span class="sr-only">Warning icon</span>
					</svelte:fragment>
					<slot />
				</Toast>
			{:else if type === 'error'}
				<Toast transition={fly} params={{ y: -200 }} color="red">
					<svelte:fragment slot="icon">
						<CloseSolid class="w-5 h-5" />
						<span class="sr-only">Error icon</span>
					</svelte:fragment>
					<slot />
				</Toast>
			{/if}
		</div>
	</div>
{/if}

<style>
	.notification-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
        z-index: 1000;
	}

	.notification-wrapper > div {
		position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
	}
</style>
