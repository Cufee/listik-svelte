<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import Trash from '../icons/Trash.svelte';
	import ItemCheckbox from './ItemCheckbox.svelte';

	let {
		item,
		check,
		remove
	}: { item: ListItem; check: (id: string) => void; remove: (id: string) => void } = $props();
</script>

<div class="flex items-center gap-1">
	<div class="flex gap-2 px-2 py-2 rounded-lg bg-base-200 grow">
		<button onclick={() => check(item.id)} class="cursor-pointer group">
			<ItemCheckbox {item} />
		</button>

		<div class="flex items-center gap-1">
			{#if (item.quantity ?? -1) > 0}
				<span class="text-blue-500">{item.quantity} x</span>
			{/if}
			<span>{item.name}</span>
		</div>
	</div>

	<button
		onclick={() => remove(item.id)}
		class="flex items-center justify-center w-10 h-10 text-white bg-red-400 rounded-lg hover:bg-red-500"
	>
		<Trash class="size-5" />
	</button>
</div>
