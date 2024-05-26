<script lang="ts">
	import { Label, Select, Input } from 'flowbite-svelte';
	import { type NotificationRecipient } from '$lib/types';

	export let recipient: NotificationRecipient;

	let recipientTypes = [
		{ value: 'reddit', name: 'Reddit' },
		{ value: 'email', name: 'Email' }
	];
</script>

<div class="w-full">
	<div class="grid gap-2 mb-2 md:grid-cols-2">
		<div>
			<Label for="type">Tipo</Label>
			<Select placeholder="Nenhum" items={recipientTypes} bind:value={recipient.type}></Select>
		</div>
		<div>
			<Label for="target">Valor</Label>
			<Input type="text" id="target" placeholder="Valor" required bind:value={recipient.target} />
		</div>
	</div>
</div>
