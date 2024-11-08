<script lang="ts">
	import Back from '$lib/components/icons/Back.svelte';

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
</div>
