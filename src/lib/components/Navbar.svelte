<script lang="ts">
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
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
	navType="application"
	class="z-50 w-10/12 overflow-hidden shadow-[0_0_16px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_0_16px_4px_rgba(0,0,0,0.5)]"
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
	<BottomNavItem btnName="Sobre" href="/sobre">
		<InfoCircleSolid />
	</BottomNavItem>
</BottomNav>
