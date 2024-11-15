<script lang="ts">
	import Content from './Content.svelte';
	import Goh from './Goh.svelte';
	import Happy1 from './Happy1.svelte';
	import Happy2 from './Happy2.svelte';
	import Love from './Love.svelte';
	import Smile from './Smile.svelte';
	import Wink from './Wink.svelte';

	let props: { class?: string } = $props();

	const variants = [Content, Happy1, Goh, Smile, Wink, Happy2, Love];
	const Item = $derived(variants[Math.floor(Math.random() * variants.length)]);
</script>

<Item class={props.class}></Item>
