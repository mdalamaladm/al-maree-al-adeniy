<script>
  let { columns, rows } = $props();
</script>

<table
  class="
    w-full
    bg-maree-accent
    text-xl
    text-maree-darker-accent
    rounded-md
    overflow-hidden
  "
>
  <thead>
    <tr>
      {#each columns as column, i (i)}
        <th
          class="
            bg-maree-dark-accent
            text-maree-accent
            p-5
            border-solid
            border-[0.5px]
            border-maree-darker-accent
          "
        >
          {column.name}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i (i)}
      <tr>
        {#each columns as column, j (j)}
          <td
            class="
              p-5
              border-solid
              border-[0.5px]
              border-maree-darker-accent
            "
          >
            {row[column.key]}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
{#if rows.length < 1}
<div
  class="
    grid
    place-content-center
    w-full
    h-64
    bg-maree-accent
    text-3xl
    text-maree-dark-accent
    border-[0.5px]
    border-t-0
    border-solid
    border-maree-darker-accent
  "
>
  <p>No Data</p>
</div>
{/if}