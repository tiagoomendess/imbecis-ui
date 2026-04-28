<script lang="ts">
	import { BottomNav, BottomNavItem, Tooltip } from 'flowbite-svelte';
	import {
		HomeSolid,
		SearchOutline,
		InfoCircleSolid,
		CirclePlusOutline,
		InboxOutline,
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<BottomNav
	{activeUrl}
	position="fixed"
	outerClass="z-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600"
	classOuter="bottom-4 start-1/2 -translate-x-1/2 rounded-full border shadow-lg overflow-hidden h-20 px-2"
	classInner="grid-cols-5"
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
	<BottomNavItem btnName="Sobre" href="/sobre">
		<InfoCircleSolid />
	</BottomNavItem>
</BottomNav>