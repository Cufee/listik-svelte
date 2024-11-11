<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex flex-col items-center w-full max-w-xl gap-6 m-auto text-center">
	<span class="text-2xl font-bold"> Welcome to Listik! </span>
	<div class="flex flex-col items-center w-full gap-2">
		<span class="font-bold text-md"> Use an invite code to join an existing list </span>
		<form
			use:enhance
			autocomplete="off"
			class="flex flex-col w-full form-control"
			id="invite-code-form"
			method="POST"
			action="?/redeem-invite"
		>
			<div class="flex flex-row form-control join">
				<input
					type="text"
					name="code"
					aria-label="invite code"
					value={form?.values?.code}
					placeholder="lk-code"
					class="join-item input input-bordered grow rounded-xl"
				/>
				<button
					formaction="?/redeem-invite"
					class="z-10 transition-colors bg-green-400 btn join-item hover:bg-green-500"
					>Redeem</button
				>
			</div>
			{#if form?.errors?.code}
				<div class="label">
					<span class="label-text-alt text-error">{form?.errors?.code}</span>
				</div>
			{/if}
		</form>
	</div>
	<div class="divider">OR</div>
	<div class="flex flex-col items-center w-full gap-2">
		<div class="text-md">
			<p class="font-bold">We can create a new list for you!</p>
			<p>You will be able to adjust the settings and invite other users to your list later on</p>
		</div>
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
						aria-label="list name"
						class="input input-bordered grow"
						placeholder="my awesome list"
						value={form?.values?.name}
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
						name="description"
						aria-label="list description"
						class="textarea textarea-bordered"
						placeholder="family shoppoing list">{form?.values?.description}</textarea
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
				class="z-10 transition-colors bg-green-400 btn join-item hover:bg-green-500"
			>
				Create your list
			</button>
		</form>
	</div>
</div>
