<script>
	import "../app.css";
	import { initFlowbite } from "flowbite";
	import { onMount } from "svelte";

	onMount(() => {
		initFlowbite();
	});
</script>

<slot />