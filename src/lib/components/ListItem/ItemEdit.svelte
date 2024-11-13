<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ListItem } from '$lib/server/db/types';
	import Trash from '../icons/Trash.svelte';
	import ItemCheckbox from './ItemCheckbox.svelte';

	let { item, check }: { item: ListItem; check: (id: string) => void } = $props();
</script>

<div class="flex items-center gap-1">
	<div class="flex gap-2 px-2 py-2 rounded-lg bg-base-200 grow">
		<button onclick={() => check(item.id)} class="cursor-pointer group">
			<ItemCheckbox {item} />
		</button>

		{#if (item.quantity ?? 1) > 1}
			<span class="text-blue-500">{item.quantity} x</span>
		{/if}
		<span>{item.name}</span>
	</div>
	<form method="POST" action="?/delete-item" use:enhance>
		<input name="id" value={item.id} class="hidden" />
		<button
			class="flex items-center justify-center w-10 h-10 text-white bg-red-400 rounded-lg hover:bg-red-500"
		>
			<Trash class="size-5" />
		</button>
	</form>
</div>
