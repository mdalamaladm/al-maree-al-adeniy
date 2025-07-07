<script>
	import Button from "./Button.svelte";
	import InputCheckbox from "./input/InputCheckbox.svelte";
	import InputSelect from "./input/InputSelect.svelte";
	import InputText from "./input/InputText.svelte";
  import { modal } from "./modal.svelte";
	import Overlay from "./Overlay.svelte";

  modal.form = {
    open ({
      form,
      submitLabel,
      cancelLabel,
      onSubmit,
    }) {
      modal.open(formContent, { form, submitLabel, cancelLabel, onSubmit })
    }
  }

  modal.confirm = {
    open ({
      message,
      cancelLabel,
      confirmLabel,
      onConfirm
    }) {
      modal.open(confirmContent, { message, cancelLabel, confirmLabel, onConfirm })
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

{#snippet formContent(close, { form, submitLabel, cancelLabel, onSubmit })}
  <form
    onsubmit={() => {
      const formValue = form.reduce((all, input) => {
        all[input.name] = input.value;

        return all;
      }, {});

      onSubmit(close, () => clearForm(form), formValue)}
    }
    class="
      w-96
      pl-10
      pr-3
      py-3
    "
  >
    {#each form as input, i (i)}
      {#if !input.noInput}
        {#if input.type === 'checkbox'}
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
          />
        {/if}
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

{#snippet confirmContent(close, { message, cancelLabel, confirmLabel, onConfirm })}
  <form
    onsubmit={() => onConfirm(close)}
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