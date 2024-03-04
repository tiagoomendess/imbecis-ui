<script>
	import '../app.css';
	import { initFlowbite } from 'flowbite';
	import { onMount } from 'svelte';
	import Navbar from '../lib/Navbar.svelte';
	import GoBackButton from '../lib/BackButton.svelte';

	onMount(() => {
		initFlowbite()
	});
</script>

<GoBackButton />
<div class="container max-w-md mx-auto p-4 mb-20">
	<slot />
</div>
<Navbar />
