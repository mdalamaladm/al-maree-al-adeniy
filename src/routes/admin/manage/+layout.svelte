<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let { children } = $props();
</script>

<Modal />
<Loader />
{@render children()}
