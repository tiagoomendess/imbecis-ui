<script lang="ts">
	import '../app.css';
	import { initFlowbite } from 'flowbite';
	import { onMount } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Loader from '$lib/components/Loader.svelte';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { isLoading } from '$lib/stores/loading';
	import { theme } from '$lib/stores/theme';
	import { navigating } from '$app/stores';
	import NotificationsWrapper from '$lib/components/NotificationsWrapper.svelte';

	navigating.subscribe((value: unknown) => {
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
		theme.init();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const onSystemThemeChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('theme')) {
				theme.setTheme(e.matches ? 'dark' : 'light');
			}
		};
		mediaQuery.addEventListener('change', onSystemThemeChange);
		return () => mediaQuery.removeEventListener('change', onSystemThemeChange);
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
<header
	class="fixed top-0 right-0 left-0 z-40 flex items-center justify-end border-b border-gray-200 bg-white px-3 py-1 dark:border-gray-700 dark:bg-gray-900"
>
	<DarkModeToggle />
</header>
<div class="main">
	<slot />
</div>
<Navbar />

<style>
	.main {
		padding-top: 44px;
		padding-bottom: 96px;
	}
</style>
