<script>
	import Button from "$lib/components/Button.svelte";
	import InputPassword from "$lib/components/input/InputPassword.svelte";
	import InputText from "$lib/components/input/InputText.svelte";

	let username = $state('');
	let password = $state('');

	async function onSubmit (e) {
		e.preventDefault();
		
		const payload = { username, password };

		const res = await fetch('/api/admin/auth', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		console.log('RES', await res.json());
	}
</script>

<section
	class="
		grid
		place-content-center
		min-h-screen
		bg-maree-main
	"
>
	<form
		onsubmit={onSubmit}
		class="
			w-96
			h-96
			p-10
			bg-white
			rounded-lg
		"
	>
		<p
			class="
				mb-7
				text-3xl
				font-medium
				text-maree-darker-accent
			"
		>
			تسجيل الدخول
		</p>
		<div
			class="mb-10"
		>
			<InputText
				label="الاسم المستخدم"
				bind:value={username}
			/>
			<InputPassword
				label="كلمة المرور"
				bind:value={password}
			/>
		</div>
		<Button
			type="solid"
			color="secondary"
			submit
			block
			label="ادخل"
		/>
	</form>
</section>
