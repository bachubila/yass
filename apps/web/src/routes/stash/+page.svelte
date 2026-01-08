<script lang="ts">
	import { tick } from 'svelte';
	import StashSidebar from '$lib/components/StashSidebar.svelte';

	// Toast system
	interface Toast {
		id: string;
		message: string;
		type: 'success' | 'error';
		duration?: number;
	}

	let toasts = $state<Toast[]>([]);

	function showToast(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
		const id = crypto.randomUUID();
		const toast = { id, message, type, duration };
		toasts = [...toasts, toast];

		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, duration);
	}

	// Mock data for now
	let stashes = $state([
		{
			id: '1',
			name: 'Quick Pastes',
			slug: 'x7f2k9',
			pasteCount: 0,
			isDefault: true,
			createdAt: new Date()
		}
	]);

	let activeStashId = $state<string | null>('1');
	let content = $state('');
	let messagesContainer = $state<HTMLDivElement | null>(null);
	let messages = $state<Array<{ role: 'user' | 'yass'; content: string }>>([
		{
			role: 'yass',
			content: `hey! welcome to yass ✨

i'm your friendly clipboard buddy. here's the deal:

→ paste anything in the box below
→ i'll give you a link to share it anywhere
→ no login, no fuss, just vibes

ready when you are! 💅`
		}
	]);

	// Track if current stash needs slug generation
	let needsSlugGeneration = $state(false);
	let currentStashSlug = $state<string | null>(null);

	// Mock database of taken slugs
	const takenSlugs = new Set(['quick-pastes', 'my-stash', 'test', 'demo', 'public', 'api']);

	async function scrollToBottom() {
		await tick(); // wait for DOM to update
		messagesContainer?.scrollTo({
			top: messagesContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function handleSelectStash(stash: { id: string }) {
		activeStashId = stash.id;
		needsSlugGeneration = false;
		const fullStash = stashes.find((s) => s.id === stash.id);
		currentStashSlug = fullStash?.slug || null;
		// TODO: Load messages for this stash
	}

	function handleCreateNew() {
		const stashName = prompt('What do you want to call your new stash?');

		if (stashName === null) return; // User cancelled

		if (!stashName.trim()) {
			showToast('Please enter a name for your stash!', 'error');
			return;
		}

		const newStash = {
			id: crypto.randomUUID(),
			name: stashName.trim(),
			slug: '', // Will be generated on first paste
			pasteCount: 0,
			isDefault: false,
			createdAt: new Date()
		};

		stashes = [...stashes, newStash];
		activeStashId = newStash.id;
		needsSlugGeneration = true;
		currentStashSlug = null;

		// Reset messages for new stash
		messages = [
			{
				role: 'yass',
				content: `created "${newStash.name}"! 🎉\n\nyour stash is ready! paste anything below to get your shareable link.`
			}
		];

		showToast(`"${newStash.name}" stash created!`, 'success');
		scrollToBottom();
	}

	async function sendMessage() {
		if (!content.trim()) return;

		messages = [...messages, { role: 'user', content: content.trim() }];
		await scrollToBottom();

		const activeStash = stashes.find((s) => s.id === activeStashId);
		if (!activeStash) return;

		let slug: string;
		let slugTaken = false;

		// Generate slug if this is the first paste in a new stash
		if (needsSlugGeneration && !activeStash.slug) {
			slug = activeStash.name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, '');

			slugTaken = takenSlugs.has(slug);

			const finalSlug = slugTaken ? Math.random().toString(36).substring(2, 8) : slug;

			// Update stash with slug
			stashes = stashes.map((s) =>
				s.id === activeStashId ? { ...s, slug: finalSlug, pasteCount: s.pasteCount + 1 } : s
			);

			// Always show the slug message on first paste
			const messageContent = slugTaken
				? `got it! here's your link:\n\nyass.app/${finalSlug}\n\nheads up: "${slug}" was taken, so i gave you this random one instead. works just the same! ✨\n\ncopied to clipboard 📋`
				: `got it! here's your link:\n\nyass.app/${finalSlug}\n\ncopied to clipboard 📋`;

			messages = [
				...messages,
				{
					role: 'yass',
					content: messageContent
				}
			];

			// Set current slug and copy to clipboard
			currentStashSlug = finalSlug;
			navigator.clipboard.writeText(`yass.app/${finalSlug}`);

			needsSlugGeneration = false;
		} else {
			// Existing stash or slug already exists
			slug = activeStash.slug || Math.random().toString(36).substring(2, 8);

			// Update paste count
			stashes = stashes.map((s) =>
				s.id === activeStashId ? { ...s, pasteCount: s.pasteCount + 1 } : s
			);

			showToast(`Content stashed!`, 'success');
		}

		await scrollToBottom();
		content = '';
	}
</script>

<div class="flex h-screen bg-pink-50">
	<!-- Sidebar -->
	<StashSidebar
		{activeStashId}
		{stashes}
		onSelect={handleSelectStash}
		onCreateNew={handleCreateNew}
	/>
    <!-- Toast Container -->
    <div class="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform space-y-2">
      {#each toasts as toast (toast.id)}
        <div
          class={[
            'transform rounded-lg border px-6 py-3 shadow-lg transition-all duration-300',
            toast.type === 'success'
              ? 'border-green-600 bg-green-300 text-black'
              : 'border-red-600 bg-red-300 text-black'
          ].join(' ')}
          role="alert"
        >
          <p class="text-sm font-medium">{toast.message}</p>
        </div>
      {/each}
    </div>
	<!-- Main Chat Area -->
	<main class="flex flex-1 flex-col">
		<!-- Messages -->
		<div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-6">
			<div class="mx-auto flex max-w-2xl flex-col gap-4">
				{#each messages as message}
					<div
						class={[
							'max-w-[80%] rounded-2xl px-4 py-3',
							message.role === 'yass'
								? 'self-start border border-pink-200 bg-white text-gray-700'
								: 'self-end bg-pink-500 text-white'
						].join(' ')}
					>
						{#if message.role === 'yass'}
							<span class="mb-1 block text-xs font-semibold text-pink-500"> yass </span>
						{/if}
						<p class="text-sm whitespace-pre-wrap">{message.content}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Fixed Slug Display -->
		{#if currentStashSlug}
			<div class="border-b border-pink-200 bg-pink-100 px-6 py-3">
				<div class="mx-auto max-w-2xl text-center">
					<p class="text-xs text-pink-600">access this stash anywhere via:</p>
					<a
						href={`https://yass.app/${currentStashSlug}`}
						target="_blank"
						class="text-sm font-medium text-pink-700 hover:text-pink-900 hover:underline"
					>
						yass.app/{currentStashSlug}
					</a>
				</div>
			</div>
		{/if}

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
                 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none"
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
