<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="flex flex-col gap-6 text-center items-center w-full max-w-xl m-auto">
	<span class="text-2xl font-bold"> Welcome to Listik! </span>
	<div class="flex flex-col gap-2 items-center w-full">
		<span class="text-md font-bold"> Use an invite code to join an existing list </span>
		<form
			use:enhance
			autocomplete="off"
			class="form-control flex flex-col w-full"
			id="invite-code-form"
			method="POST"
			action="?/redeem-invite"
		>
			<div class="form-control flex flex-row join">
				<input
					type="text"
					name="code"
					aria-label="invite code"
					value={form?.values?.code}
					placeholder="lk-code"
					class="join-item input input-bordered grow rounded-xl"
				/>
				<button formaction="?/redeem-invite" class="btn join-item z-10 btn-primary">Redeem</button>
			</div>
			{#if form?.errors?.code}
				<div class="label">
					<span class="label-text-alt text-error">{form?.errors?.code}</span>
				</div>
			{/if}
		</form>
	</div>
	<div class="divider">OR</div>
	<div class="flex flex-col gap-2 items-center w-full">
		<div class="text-md">
			<p class="font-bold">We can create a new list for you!</p>
			<p>You will be able to adjust the settings and invite other users to your list later on</p>
		</div>
		<form
			use:enhance
			autocomplete="off"
			class="form-control flex flex-col gap-2 w-full"
			method="POST"
			action="?/new-list"
		>
			<fieldset class="flex flex-col gap-2" id="create-list-form">
				<div class="form-control">
					<div class="label">
						<span class="label-text-alt text-lg">Name</span>
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
					<div class="label flex flex-row justify-between">
						<span class="label-text-alt text-lg">Description</span>
						<span class="badge badge-info">Optional</span>
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
			<button formaction="?/new-list" class="btn join-item z-10 btn-primary"
				>Create your first list</button
			>
		</form>
	</div>
</div>
