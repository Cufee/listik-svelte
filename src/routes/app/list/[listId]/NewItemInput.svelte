<script lang="ts">
	import { deserialize } from '$app/forms';
	import { autofocus } from '$lib/actions/autofocus';
	import Enter from '$lib/components/icons/Enter.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount, tick } from 'svelte';
	import type { ActionData } from './$types';
	import { itemStore } from './items.svelte';

	let items = itemStore();

	let input: HTMLInputElement | null = $state(null);
	let values: Record<string, string> = $state({});
	let errors: Record<string, string> = $state({});
	export const clearError = () => {
		errors = {};
		if (!input) return;

		input.placeholder = 'banana';
		input.classList.remove('placeholder:text-red-400');
	};
	onMount(() => {
		clearError();
	});

	let form: HTMLFormElement | null = $state(null);
	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!form) return;
		input?.focus();

		if (!values.name || values.name.length < 3) {
			errors.name = 'input too short';
			return;
		}

		const data = new FormData(form);
		const response = await fetch(form.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());
		if (result.type === 'failure') {
			const data = result.data as ActionData;
			errors = data?.errors || {};
			values = data?.values || {};
			return;
		}
		if (result.type === 'success') {
			const data = result.data as ActionData;
			errors = {};
			values = {};

			switch (data?.action) {
				case 'save-item':
					items.push(data.item);
					await tick();
					window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
					break;

				case 'delete-item':
					items.remove(data.item);
					break;

				default:
					break;
			}
		}
	}
</script>

<form
	method="POST"
	action="?/save-item"
	class="flex items-center h-12 max-w-3xl px-4 overflow-hidden rounded-lg grow bg-base-200"
	onsubmit={handleSubmit}
	bind:this={form}
>
	<!-- <select
		name="quantity"
		size="2"
		class="w-12 !outline-none text-center no-scrollbar rounded-none bg-base-200 mr-2 checked:bg-base-300"
	>
		<option value="-1" class="flex items-center justify-center h-12 rounded-r-md" selected>∞</option
		>
		{#each { length: 99 } as _, i}
			<option value={i + 1} class="py-2 rounded-r-md">{i + 1}</option>
		{/each}
	</select> -->

	<!-- svelte-ignore a11y_autofocus -->
	<input
		name="name"
		type="text"
		minlength="1"
		maxlength="32"
		placeholder="bananas"
		class="w-full grow !outline-none bg-transparent rounded-none placeholder:text-gray-400"
		bind:value={values.name}
		oninput={clearError}
		bind:this={input}
		use:autofocus
	/>
	<span class:text-gray-400={!errors.name} class:text-rose-300={errors.name}>
		<Enter class="size-6" />
	</span>
</form>
