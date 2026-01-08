<!-- src/lib/components/StashSidebar.svelte -->
<script lang="ts">
  type Stash = {
    id: string;
    name: string;
    slug: string;
    pasteCount: number;
    isDefault: boolean;
    createdAt: Date;
  };

  type Props = {
    stashes: Stash[];
    activeStashId: string | null;
    onSelect: (stash: Stash) => void;
    onCreateNew: () => void;
  };

  let { stashes, activeStashId, onSelect, onCreateNew }: Props = $props();

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
</script>

<aside class="flex w-72 flex-col border-r border-pink-800 bg-white">
  <!-- Header -->
  <div class="border-b border-pink-800 p-4">
    <h1 class="text-xl font-bold text-black">yass</h1>
    <p class="text-sm text-neutral-700">yet another sync service</p>
  </div>

  <!-- Stash List -->
  <div class="flex-1 overflow-y-auto p-4">
    <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
      your stash
    </h2>

    <div class="flex flex-col gap-1">
      {#each stashes as stash (stash.id)}
        <button
          onclick={() => onSelect(stash)}
          class={[
            "flex w-full flex-col rounded-lg px-3 py-2 text-left cursor-pointer transition-colors",
            activeStashId === stash.id
              ? "bg-pink-100 border border-pink-300"
              : "hover:bg-pink-50 border border-transparent",
          ].join(" ")}
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-neutral-900 truncate">
              {stash.name}
              {#if stash.isDefault}
                <span class="ml-1 text-pink-500">⚡</span>
              {/if}
            </span>
            <span class="ml-2 rounded-full bg-pink-200 px-2 py-0.5 text-xs text-pink-700">
              {stash.pasteCount}
            </span>
          </div>
          <span class="mt-0.5 text-xs text-neutral-500">
            {formatDate(stash.createdAt)}
          </span>
        </button>
      {/each}

      {#if stashes.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <div class="mb-3 text-4xl">🗃️</div>
          <p class="text-sm text-neutral-800">your stash is empty</p>
          <p class="mt-1 text-xs text-neutral-700">paste something to get started</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- New Stash Button -->
  <div class="border-t border-pink-200 p-4">
    <button
      onclick={onCreateNew}
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-pink-300 
             bg-white px-4 py-2 text-sm font-medium text-pink-600 
             transition-colors hover:bg-pink-50"
    >
      <span class="text-lg">+</span>
      New Stash
    </button>
    <p class="mt-3 text-center text-xs text-neutral-500">
      pastes are stored locally via deviceId
    </p>
  </div>
</aside>