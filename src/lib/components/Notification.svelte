<script lang="ts">
	import type { NotificationType } from '../types';
	import { Toast } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let message: string;
	export let type: NotificationType = 'info';
	export let duration = 5;
	export let ondismiss: (() => void) | undefined = undefined;

	let toastStatus = false;
	let initialized = false;
	let dismissed = false;

	function handleDismiss() {
		if (!dismissed) {
			dismissed = true;
			ondismiss?.();
		}
	}

	$: if (initialized && !toastStatus) {
		handleDismiss();
	}

	onMount(() => {
		const showTimer = setTimeout(() => {
			toastStatus = true;
			initialized = true;
		}, 50);

		const hideTimer = setTimeout(() => {
			toastStatus = false;
		}, duration * 1000);

		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	});

	const colorMap: Record<NotificationType, 'green' | 'red' | 'orange' | 'blue'> = {
		success: 'green',
		error: 'red',
		warning: 'orange',
		info: 'blue'
	};
</script>

<div class="mb-1">
	<Toast color={colorMap[type]} transition={fly} params={{ y: -200 }} bind:toastStatus>
		<span class="flex items-center gap-2">
			{#if type === 'success'}
				<CheckCircleSolid class="h-5 w-5 shrink-0" />
			{:else if type === 'error'}
				<CloseCircleOutline class="h-5 w-5 shrink-0" />
			{:else}
				<ExclamationCircleSolid class="h-5 w-5 shrink-0" />
			{/if}
			{message}
		</span>
	</Toast>
</div>
