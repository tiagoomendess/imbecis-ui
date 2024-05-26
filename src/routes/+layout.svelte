<script lang="ts">
	import '../app.css';
	import { initFlowbite } from 'flowbite';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { isLoading } from '$lib/stores/loading';
	import { navigating } from '$app/stores';
	import NotificationsWrapper from '$lib/components/NotificationsWrapper.svelte';

	navigating.subscribe((value) => {
		isLoading.set(value !== null);
	});

	const ensuredeviceUUID = () => {
		if (!localStorage) return;

		const deviceUuid = localStorage.getItem('deviceUUID');
		if (!deviceUuid) {
			localStorage.setItem('deviceUUID', uuidv4());
		}
	};

	onMount(() => {
		initFlowbite();
		ensuredeviceUUID();
	});
</script>

<svelte:head>
	<meta name="apple-mobile-web-app-status-bar-style" content="white" />
	<link rel="apple-touch-startup-image" href="/imbecis_logo_300.png" />
	<link rel="apple-touch-icon" href="/imbecis_logo_300.png" />
	<link rel="apple-touch-icon-precomposed" sizes="128x128" href="/imbecis_logo_300.png" />

	<link rel="shortcut icon" sizes="196x196" href="/imbecis_logo_300.png" />
	<link rel="shortcut icon" sizes="128x128" href="/imbecis_logo_300.png" />
</svelte:head>
<NotificationsWrapper />
<Loader />
<main class="master" id="master">
	<slot />
</main>

<Navbar />

<style>
	.master {
		height: calc(100vh - 64px);
        overflow-y: auto;
	}
</style>
