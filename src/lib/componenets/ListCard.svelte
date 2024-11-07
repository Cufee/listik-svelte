<script lang="ts">
	import type { List } from '$lib/server/db/schema';

	let { list }: { list: List } = $props();
</script>

<a
	href={`/app/list/${list.id}`}
	class="flex flex-row p-4 gap-2 items-center bg-base-200 hover:bg-base-300 rounded-xl"
>
	<div class="flex flex-row grow gap-2 justify-between items-center">
		<span class="text-lg">{list.name}</span>
		{#if list.description}
			<span class="text-gray-500">{list.description}</span>
		{/if}
	</div>
</a>
