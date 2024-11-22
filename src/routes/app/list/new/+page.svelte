<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Listik - New List</title>
</svelte:head>

<div class="flex flex-col justify-center w-full max-w-sm gap-4 mx-auto">
	<h1 class="text-xl text-center">Create a new list</h1>
	<form
		use:enhance
		autocomplete="off"
		class="flex flex-col w-full gap-2 form-control"
		method="POST"
		action="?/new-list"
	>
		<fieldset class="flex flex-col gap-2" id="create-list-form">
			<div class="form-control">
				<div class="label">
					<span class="text-lg label-text-alt">Name</span>
				</div>
				<input
					name="name"
					type="text"
					minlength="3"
					maxlength="14"
					aria-label="list name"
					class="input input-bordered grow"
					placeholder="my awesome list"
					value={form?.values?.name ?? ''}
				/>
			</div>
			{#if form?.errors?.name}
				<div class="label">
					<span class="label-text-alt text-error">{form?.errors?.name}</span>
				</div>
			{/if}
			<div class="form-control">
				<div class="flex flex-row justify-between label">
					<span class="text-lg label-text-alt">Description</span>
					<span class="py-4 bg-blue-300 badge">Optional</span>
				</div>
				<textarea
					maxlength="80"
					name="description"
					aria-label="list description"
					class="textarea textarea-bordered"
					placeholder="family shopping list">{form?.values?.description ?? ''}</textarea
				>
			</div>
			{#if form?.errors?.description}
				<div class="label">
					<span class="label-text-alt text-error">{form?.errors?.description}</span>
				</div>
			{/if}
		</fieldset>
		<button
			formaction="?/new-list"
			class="z-10 transition-colors bg-green-400 btn join-item hover:bg-green-500">Create</button
		>
	</form>
</div>
