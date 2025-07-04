<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';

	let { children } = $props();
</script>

<Modal />
{@render children()}
