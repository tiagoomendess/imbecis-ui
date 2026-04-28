<script lang="ts">
	import { notifications } from '$lib/stores/notificationStore';
	import type { Notification as NotificationItem } from '$lib/types';
	import Notification from '$lib/components/Notification.svelte';

	function dismiss(id: number) {
		notifications.update((n: NotificationItem[]) =>
			n.filter((item: NotificationItem) => item.id !== id)
		);
	}
</script>

{#if $notifications.length > 0}
	<div class="wrapper w-full">
		{#each $notifications as notification (notification.id)}
			<Notification
				message={notification.message}
				type={notification.type}
				ondismiss={() => dismiss(notification.id)}
			/>
		{/each}
	</div>
{/if}

<style>
	.wrapper {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9999;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column-reverse;
	}
</style>
