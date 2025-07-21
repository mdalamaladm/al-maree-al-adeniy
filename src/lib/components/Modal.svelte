<script>
	import { enhance } from "$app/forms";
	import Button from "./Button.svelte";
	import InputCheckbox from "./input/InputCheckbox.svelte";
	import InputSelect from "./input/InputSelect.svelte";
	import InputText from "./input/InputText.svelte";
  import { modal } from "./modal.svelte";
	import Overlay from "./Overlay.svelte";

  modal.form = {
    open (params) {
      modal.open(formContent, params)
    }
  }

  modal.confirm = {
    open (params) {
      modal.open(confirmContent, params)
    }
  }

  function clearForm (form) {
    form.forEach(input => {
      if (input.type === 'checkbox') {
        input.value = false;
      } else {
        input.value = null;
      }
    });
  }
</script>

{#snippet formContent(close, { form, formAction, submitLabel, cancelLabel })}
  <form
    method="POST"
    action={formAction || ''}
		use:enhance={() => {
      return async function ({ result, update }) {
        if (result.type === 'success') {
          clearForm(form);
          close();

          await update();
        }
      }
    }}
    class="
      w-96
      pl-10
      pr-3
      py-3
    "
  >
    {#each form as input, i (i)}
      {#if input.type === 'snippet'} 
        {@render input.snippet(input, form, i)}
      {:else if input.type === 'checkbox'}
        <InputCheckbox
          label={input.label}
          name={input.name}
          bind:checked={input.value}
          class="
            mb-5
          "
        />
      {:else if input.type === 'text'}
        <InputText
          label={input.label}
          name={input.name}
          bind:value={input.value}
          class="
            mb-5
          "
        />
      {:else if input.type === 'select'}
        <InputSelect
          label={input.label}
          name={input.name}
          options={input.options}
          bind:value={input.value}
          getter={input.getter}
          setter={input.setter}
          class="
            mb-5
          "
          {...input.props}
        />
      {/if}
    {/each}
    <div
      class="
        flex
        mt-10
      "
    >
      <Button
        onclick={() => {
          clearForm(form);
          close();
        }}
        type="solid"
        color="secondary"
        label={cancelLabel}
      />
      <Button
        type="solid"
        color="dark-accent"
        label={submitLabel}
        submit
        class="
          mr-5
        "
      />
    </div>
  </form>
{/snippet}

{#snippet confirmContent(close, { formAction, message, cancelLabel, confirmLabel, onConfirm = () => {} })}
  <form
    onsubmit={() => onConfirm(close)}
    method="POST"
    action={formAction}
    use:enhance={() => {
      return async function ({ result, update }) {
        if (result.type === 'success') {
          close();

          await update();
        }
      }
    }}
    class="
      p-5
    "
  >
    <p
      class="
        mb-5
        text-2xl
        text-maree-darker-accent
      "
    >
      {message}
    </p>
    <div
      class="
        flex
        justify-start
      "
    >
      <Button
        onclick={() => {
          close();
        }}
        type="solid"
        color="secondary"
        label={cancelLabel}
        class="
          ml-5
        "
      />
      <Button
        type="solid"
        color="dark-accent"
        label={confirmLabel}
        submit
      />
    </div>
  </form>
{/snippet}

{#snippet base(id, content, props)}
  <Overlay
    center={props?.center === false ? false : true}
    open
    onClose={() => modal.close(id)}
  >
    <div
      class="{props?.className || 'p-5 bg-white rounded-lg'}"
    >
      {@render content(() => modal.close(id), props)}
    </div>
  </Overlay>
{/snippet}

{#each modal.data as { id, content, props } (id) }
  {@render base(id, content, props)}
{/each}