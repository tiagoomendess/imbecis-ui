<script lang="ts">
	import { notifications } from '$lib/stores/notificationStore';
	import Notification from '$lib/Notification.svelte';
</script>

<div class="w-full wrapper">
	{#each $notifications as notification (notification.id)}
		<Notification message={notification.message} type={notification.type}/>
	{/each}
</div>

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
