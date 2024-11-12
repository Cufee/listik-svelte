<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import ItemEdit from './ItemEdit.svelte';
	import ItemView from './ItemView.svelte';

	let {
		item,
		mode,
		check
	}: {
		item: ListItem;
		mode: 'shopping' | 'edit';
		check: (id: string) => void;
	} = $props();
</script>

{#if mode === 'shopping'}
	<ItemView {item} {check} />
{:else}
	<ItemEdit {item} {check} />
{/if}
