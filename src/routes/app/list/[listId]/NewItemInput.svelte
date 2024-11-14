<script lang="ts">
	import { enhance } from '$app/forms';
	import { autofocus } from '$lib/actions/autofocus';
	import Plus from '$lib/components/icons/Plus.svelte';
	import { onMount, untrack } from 'svelte';

	let {
		errors,
		values
	}: {
		errors?: Record<string, string>;
		values?: Record<string, string>;
	} = $props();

	let input: HTMLInputElement | null = $state(null);
	export const focus = () => {
		input?.focus();
	};

	let inputValue = $state(values?.name ?? '');
	export const clearError = () => {
		inputValue = '';
		if (!input) return;

		input.placeholder = 'banana';
		input.classList.remove('placeholder:text-red-400');
	};
	$effect(() => {
		if (values?.name) {
			untrack(() => {
				inputValue = values.name;
			});
		}
	});
	onMount(() => {
		clearError();
	});
</script>

<form
	class="flex max-w-3xl overflow-hidden rounded-lg grow bg-base-200"
	method="POST"
	action="?/save-item"
	use:enhance
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
		bind:this={input}
		autofocus={true}
		use:autofocus
		name="name"
		type="text"
		minlength="3"
		maxlength="32"
		data-placeholder="bananas"
		class="w-full grow !outline-none bg-base-200 rounded-none px-4"
		class:placeholder:text-red-400={!!errors?.name}
		placeholder={errors?.name || 'bananas'}
		value={values?.name ?? ''}
		oninput={clearError}
	/>
	<button
		type="submit"
		class="transition-colors bg-green-400 rounded-l-none btn btn-square hover:bg-green-500"
	>
		<Plus class="size-6" />
	</button>
</form>
