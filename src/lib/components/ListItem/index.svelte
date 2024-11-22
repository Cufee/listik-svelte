<script lang="ts">
	import type { ListItem } from '$lib/server/db/types';
	import ItemEdit from './ItemEdit.svelte';
	import ItemView from './ItemView.svelte';

	let props: {
		item: ListItem;
		mode: 'shopping' | 'edit';
		check: (id: string) => void;
		remove: (id: string) => void;
		class?: string;
	} = $props();
</script>

{#if props.mode === 'shopping'}
	<ItemView {...props} />
{:else}
	<ItemEdit {...props} />
{/if}
