<script lang="ts">
	let { children } = $props();
</script>

<section class="h-full bg-maree-main">
	<a href="/">الرئيسية</a>
	{@render children()}
</section>
