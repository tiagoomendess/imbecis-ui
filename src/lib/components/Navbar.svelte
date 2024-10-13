<script lang="ts">
	import { BottomNav, BottomNavItem, Tooltip } from 'flowbite-svelte';
	import {
		HomeSolid,
		SearchOutline,
		InfoCircleSolid,
		CirclePlusOutline,
		InboxOutline,
		WalletSolid,
		PlusOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<BottomNav
	{activeUrl}
	position="fixed"
	classInner="grid-cols-5"
	outerClass="z-50 w-full"
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