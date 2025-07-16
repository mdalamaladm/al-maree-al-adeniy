<script>
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/Button.svelte";
	import InputPassword from "$lib/components/input/InputPassword.svelte";
	import InputText from "$lib/components/input/InputText.svelte";
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
		method="POST"
		use:enhance
		class="
			w-96
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
				name="username"
				class="
					mb-5
				"
			/>
			<InputPassword
				label="كلمة المرور"
				name="password"
			/>
		</div>
		<Button
			type="solid"
			color="secondary"
			submit
			block
			label="تسجيل الدخول"
		/>
	</form>
</section>
