<script>
	import {
		HomeSolid,
		SearchOutline,
		PlusSolid,
		InfoCircleSolid,
		AngleLeftOutline,
		CirclePlusOutline,
		InboxOutline
	} from 'flowbite-svelte-icons';
</script>

<div class="fixed inset-x-0 bottom-0 bg-gray-100 border-t-2 border-gray-300">
	<nav class="flex justify-between items-center max-w-md mx-auto p-4">
		<!-- Home Button -->
		<a href="/" class="flex flex-col items-center text-xs text-gray-700">
			<HomeSolid />
			Home
		</a>

		<!-- Search Button -->
		<a href="/search" class="flex flex-col items-center text-xs text-gray-700">
			<SearchOutline />
			Search
		</a>

		<!-- Add Button -->
		<a href="/add" class="flex flex-col items-center text-xs text-black">
			<CirclePlusOutline/>
			Add
		</a>

		<!-- Vote Button -->
		<a href="/vote" class="flex flex-col items-center text-xs text-gray-700">
			<InboxOutline />
			Vote
		</a>

		<!-- About Button -->
		<a href="/about" class="flex flex-col items-center text-xs text-gray-700">
			<InfoCircleSolid />
			About
		</a>
	</nav>
</div>
