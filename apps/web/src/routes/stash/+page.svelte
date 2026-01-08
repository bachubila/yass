<script lang="ts">
	import { tick } from "svelte";

  let content = $state("");
    let messagesContainer = $state<HTMLDivElement | null>(null);
  let messages = $state<Array<{ role: "user" | "yass"; content: string }>>([
    {
      role: "yass",
      content: `hey! welcome to yass ✨

i'm your friendly clipboard buddy. here's the deal:

→ paste anything in the box below
→ i'll give you a link to share it anywhere
→ no login, no fuss, just vibes

oh and don't worry — i remember your stuff on this device using a lil' thing called a deviceId (it lives in your browser's localStorage). so your stash stays yours, even if you refresh.

ready when you are! 💅`,
    },
  ]);

 async function scrollToBottom() {
    await tick(); // wait for DOM to update
    messagesContainer?.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth",
    });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    if (!content.trim()) return;

    messages = [...messages, { role: "user", content: content.trim() }];
    await scrollToBottom();

    // TODO: Call Convex mutation here, get slug back
    const fakeSlug = Math.random().toString(36).substring(2, 8);

    messages = [
      ...messages,
      {
        role: "yass",
        content: `got it! here's your link:\n\nyass.app/${fakeSlug}\n\ncopied to clipboard 📋`,
      },
    ];
    await scrollToBottom();

    content = "";
  }
</script>

<div class="flex h-screen bg-pink-50">
  <!-- Sidebar -->
  <aside class="flex w-72 flex-col border-r border-pink-200 bg-white">
    <div class="border-b border-pink-800 p-4">
      <h1 class="text-xl font-bold text-black">yass</h1>
      <p class="text-sm text-neutral-700">yet another sync service</p>
    </div>

    <div class="flex-1 p-4">
      <h2 class="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-600">
        your stash
      </h2>
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="mb-3 text-4xl">🗃️</div>
        <p class="text-sm text-neutral-800">your stash is empty</p>
        <p class="mt-1 text-xs text-neutral-700">paste something to get started</p>
      </div>
    </div>

    <div class="border-t border-pink-200 p-4">
      <p class="text-xs text-neutral-800">
        pastes are stored locally via deviceId
      </p>
    </div>
  </aside>

  <!-- Main Chat Area -->
  <main class="flex flex-1 flex-col">
    <!-- Messages -->
    <div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-6">
      <div class="mx-auto flex max-w-2xl flex-col gap-4">
        {#each messages as message}
          <div
            class={[
              "max-w-[80%] rounded-2xl px-4 py-3",
              message.role === "yass"
                ? "self-start bg-white border border-pink-200 text-gray-700"
                : "self-end bg-pink-500 text-white",
            ].join(" ")}
          >
            {#if message.role === "yass"}
              <span class="mb-1 block text-xs font-semibold text-pink-500">
                yass
              </span>
            {/if}
            <p class="whitespace-pre-wrap text-sm">{message.content}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-pink-200 bg-pink-50 p-4">
      <div class="mx-auto flex max-w-2xl gap-3">
        <textarea
          bind:value={content}
          onkeydown={handleKeydown}
          placeholder="paste your content here..."
          rows="3"
          class="flex-1 resize-none rounded-xl border border-pink-200 px-4 py-3 text-sm
                 placeholder-gray-600 transition-colors
                 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
        ></textarea>
        <button
          onclick={sendMessage}
          disabled={!content.trim()}
          class="self-end rounded-xl bg-pink-500 px-6 py-3 text-sm font-medium
                 text-white transition-colors hover:bg-pink-600
                 disabled:cursor-not-allowed disabled:opacity-50"
        >
          stash
        </button>
      </div>
      <p class="mx-auto mt-2 max-w-2xl text-xs text-neutral-800">
        press Enter to send • Shift+Enter for new line
      </p>
    </div>
  </main>
</div>