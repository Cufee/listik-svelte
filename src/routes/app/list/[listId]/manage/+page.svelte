<script lang="ts">
	import Back from '$lib/components/icons/Back.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-4 grow">
	<div class="flex flex-row justify-between gap-4 items-top">
		<div class="flex flex-col">
			<h1 class="text-xl">{data.list.name}</h1>
			{#if data.list.description}
				<span>{data.list.description}</span>
			{/if}
		</div>
		<div class="flex gap-2">
			<a href={`/app/list/${data.list.id}`} class="btn btn-dark btn-square">
				<Back class="size-6" />
			</a>
		</div>
	</div>
	<div class="flex flex-col">
		<div class="flex items-center justify-between gap-2">
			<h1 class="text-lg">Categories</h1>
			{#if data.list.ownerId === data.user.id}
				<button class="p-1.5 transition-colors bg-blue-400 rounded-lg hover:bg-blue-500">
					<Plus class="size-4" />
				</button>
			{/if}
		</div>
		{#if data.list.tags.length === 0}
			<span class="text-gray-400">This list does not have any categories yet</span>
		{:else}
			<div class="flex gap-1">
				{#each data.list.tags as tag}
					<button class="btn btn-dark">{tag.name}</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
