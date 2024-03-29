<script lang="ts">
	import type { NotificationType } from './types';
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import * as Icon from 'flowbite-svelte-icons';

	export let message: string;
	export let type: NotificationType = 'info';
	export let duration = 5;
	let open = false;

	onMount(() => {
		setTimeout(() => {
			open = true;
		}, 50);

		setTimeout(() => {
			open = false;
		}, duration * 1000);
	});
</script>

<div class="mb-1">
	{#if type === 'success'}
		<Toast color="green" transition={fly} params={{ y: -200 }} bind:open>
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			{message}
		</Toast>
	{/if}

	{#if type === 'error'}
		<Toast color="red" transition={fly} params={{ y: -200 }} bind:open>
			<svelte:fragment slot="icon">
				<CloseSolid class="w-5 h-5" />
				<span class="sr-only">Error icon</span>
			</svelte:fragment>
			{message}
		</Toast>
	{/if}

	{#if type === 'warning'}
		<Toast color="orange" transition={fly} params={{ y: -200 }} bind:open>
			<svelte:fragment slot="icon">
				<ExclamationCircleSolid class="w-5 h-5" />
				<span class="sr-only">Warning icon</span>
			</svelte:fragment>
			{message}
		</Toast>
	{/if}

	{#if type === 'info'}
		<Toast color="blue" transition={fly} params={{ y: -200 }} bind:open>
			<svelte:fragment slot="icon">
				<ExclamationCircleSolid class="w-5 h-5" />
				<span class="sr-only">Info icon</span>
			</svelte:fragment>
			{message}
		</Toast>
	{/if}
</div>
