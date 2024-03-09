<script lang="ts">
	import '../app.css';
	import { initFlowbite } from 'flowbite';
	import { onMount } from 'svelte';
	import Navbar from '$lib/Navbar.svelte';
	import Loader from '$lib/Loader.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { isLoading } from '$lib/stores/loading';
	import { navigating } from '$app/stores';

	navigating.subscribe((value) => {
		isLoading.set(value !== null);
	});

	const ensuredeviceUUID = () => {
		if (!localStorage)
			return

		const deviceUuid = localStorage.getItem('deviceUuid');
		if (!deviceUuid) {
			localStorage.setItem('deviceUUID', uuidv4());
		}
	}

	onMount(() => {
		initFlowbite()
		ensuredeviceUUID()
	});

</script>

<Loader/>
<div class="w-full">
	<div class="container max-w-md mx-auto p-4 mb-20">
		<slot />
	</div>
</div>
<Navbar />
