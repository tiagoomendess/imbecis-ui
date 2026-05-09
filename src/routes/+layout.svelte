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
	import { navigating, page } from '$app/stores';
	import NotificationsWrapper from '$lib/components/NotificationsWrapper.svelte';
	import { globalMapView } from '$lib/stores/mapView';

	$: isMapPage = $page.url.pathname === '/mapa';

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
	class="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white px-3 py-1 dark:border-gray-700 dark:bg-gray-900"
>
	{#if isMapPage}
		<div class="map-toggle">
			<button
				class="toggle-pill"
				class:active={!$globalMapView}
				onclick={() => globalMapView.set(false)}
			>
				Esta App
			</button>
			<button
				class="toggle-pill"
				class:active={$globalMapView}
				onclick={() => globalMapView.set(true)}
			>
				Canales Map
			</button>
		</div>
	{:else}
		<div></div>
	{/if}
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

	.map-toggle {
		display: flex;
		gap: 2px;
		padding: 3px;
		border-radius: 9999px;
		background: rgb(243 244 246);
		border: 1px solid rgb(229 231 235);
	}

	:global(.dark) .map-toggle {
		background: rgb(55 65 81);
		border-color: rgb(75 85 99);
	}

	.toggle-pill {
		padding: 4px 14px;
		border-radius: 9999px;
		font-size: 0.8125rem;
		font-weight: 500;
		cursor: pointer;
		border: none;
		background: transparent;
		color: rgb(107 114 128);
		transition:
			background 0.18s,
			color 0.18s;
		white-space: nowrap;
	}

	.toggle-pill.active {
		background: rgb(37 99 235);
		color: white;
	}

	:global(.dark) .toggle-pill {
		color: rgb(156 163 175);
	}

	:global(.dark) .toggle-pill.active {
		background: rgb(37 99 235);
		color: white;
	}
</style>
