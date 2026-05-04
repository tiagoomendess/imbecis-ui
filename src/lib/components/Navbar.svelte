<script lang="ts">
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		SearchOutline,
		CirclePlusOutline,
		InboxOutline,
		UserCircleOutline,
		InfoCircleSolid,
		CaretUpSolid,
		MapPinAltSolid,
		ApiKeyOutline,
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;

	let menuOpen = false;
	let menuBottom = 0;
	let menuRight = 0;

	const toggleMenu = (e: MouseEvent) => {
		if (!menuOpen) {
			const btn = (e.target as HTMLElement).closest('button') ?? (e.currentTarget as HTMLElement);
			const rect = btn.getBoundingClientRect();
			menuBottom = window.innerHeight - rect.top + 8;
			menuRight = window.innerWidth - rect.right;
		}
		menuOpen = !menuOpen;
	};

	const closeMenu = () => {
		menuOpen = false;
	};
</script>

<BottomNav
	{activeUrl}
	position="fixed"
	navType="application"
	class="z-50 w-10/12 overflow-hidden shadow-[0_0_16px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_0_16px_4px_rgba(0,0,0,0.5)]"
	style="bottom: 9px;"
	classes={{ inner: 'grid-cols-5' }}
>
	<BottomNavItem btnName="Inicio" href="/">
		<HomeSolid />
	</BottomNavItem>
	<BottomNavItem btnName="Procurar" href="/procurar">
		<SearchOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Novo" href="/adicionar">
		<CirclePlusOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Votar" href="/votar">
		<InboxOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Mais" onclick={toggleMenu}>
		<CaretUpSolid />
	</BottomNavItem>
</BottomNav>

{#if menuOpen}
	<!-- Transparent backdrop — closes menu on outside tap -->
	<div class="fixed inset-0 z-40" onclick={closeMenu} aria-hidden="true"></div>

	<!-- Popup menu, anchored above the tapped button -->
	<div
		class="fixed z-50 min-w-40 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 dark:shadow-black/60"
		style="bottom: {menuBottom}px; right: {menuRight}px;"
	>
		<a
			href="/eu"
			onclick={closeMenu}
			class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
		>
			<UserCircleOutline class="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
			Meu Perfil
		</a>
		<div class="mx-3 border-t border-gray-100 dark:border-gray-700"></div>
		<a
			href="/mapa"
			onclick={closeMenu}
			class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
		>
			<MapPinAltSolid class="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
			Mapa
		</a>
		<div class="mx-3 border-t border-gray-100 dark:border-gray-700"></div>
		<a
			href="/sobre"
			onclick={closeMenu}
			class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
		>
			<InfoCircleSolid class="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
			Sobre
		</a>
		<div class="mx-3 border-t border-gray-100 dark:border-gray-700"></div>
		<a
			href="/developers"
			onclick={closeMenu}
			class="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
		>
			<ApiKeyOutline class="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
			Programadores
		</a>
	</div>
{/if}
