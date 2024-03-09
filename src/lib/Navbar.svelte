<script lang="ts">
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		SearchOutline,
		InfoCircleSolid,
		CirclePlusOutline,
		InboxOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
</script>

<BottomNav {activeUrl} position="fixed" classInner="grid-cols-5">
	<BottomNavItem btnName="Inicio" href="/">
		<HomeSolid />
	</BottomNavItem>
	<BottomNavItem btnName="Procurar" href="/search" exact={false}>
		<SearchOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Novo" href="/add">
		<CirclePlusOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Votar" href="/vote">
		<InboxOutline />
	</BottomNavItem>
	<BottomNavItem btnName="Sobre" href="/about">
		<InfoCircleSolid />
	</BottomNavItem>
</BottomNav>
