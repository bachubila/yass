<script lang="ts">
	import { tick } from 'svelte';
	import StashSidebar from '$lib/components/StashSidebar.svelte';

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
	let isNamingNewStash = $state(false);
	let newStashName = $state('');
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

oh and don't worry — i remember your stuff on this device using a lil' thing called a deviceId (it lives in your browser's localStorage). so your stash stays yours, even if you refresh.

ready when you are! 💅`
		}
	]);

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
		isNamingNewStash = false;
		// TODO: Load messages for this stash
	}

	function handleCreateNew() {
		const stashName = prompt('What do you want to call your new stash?');

		if (stashName === null) return; // User cancelled

		if (!stashName.trim()) {
			alert('Please enter a name for your stash!');
			return;
		}

		const slug = stashName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

		// TODO: Check if slug exists in DB, generate fallback if needed
		const slugTaken = false; // Replace with actual check

		const finalSlug = slugTaken ? Math.random().toString(36).substring(2, 8) : slug;

		const newStash = {
			id: crypto.randomUUID(),
			name: stashName.trim(),
			slug: finalSlug,
			pasteCount: 0,
			isDefault: false,
			createdAt: new Date()
		};

		stashes = [...stashes, newStash];
		activeStashId = newStash.id;

		const responseMessage = slugTaken
			? `created "${newStash.name}"! 🎉\n\nheads up: "${slug}" was taken, so i gave you:\nyass.app/${finalSlug}\n\nnow paste away!`
			: `created "${newStash.name}"! 🎉\n\nyour link: yass.app/${finalSlug}\n\nnow paste away!`;

		messages = [
			{
				role: 'yass',
				content: responseMessage
			}
		];

		isNamingNewStash = false;
		scrollToBottom();
	}

	async function handleNameSubmit() {
		if (!newStashName.trim()) return;

		const slug = newStashName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');

		// TODO: Check if slug exists in DB, generate fallback if needed
		const slugTaken = false; // Replace with actual check

		const finalSlug = slugTaken ? Math.random().toString(36).substring(2, 8) : slug;

		const newStash = {
			id: crypto.randomUUID(),
			name: newStashName.trim(),
			slug: finalSlug,
			pasteCount: 0,
			isDefault: false,
			createdAt: new Date()
		};

		stashes = [...stashes, newStash];
		activeStashId = newStash.id;

		const responseMessage = slugTaken
			? `created "${newStash.name}"! 🎉\n\nheads up: "${slug}" was taken, so i gave you:\nyass.app/${finalSlug}\n\nnow paste away!`
			: `created "${newStash.name}"! 🎉\n\nyour link: yass.app/${finalSlug}\n\nnow paste away!`;

		messages = [
			...messages,
			{ role: 'user', content: newStashName.trim() },
			{ role: 'yass', content: responseMessage }
		];

		isNamingNewStash = false;
		newStashName = '';
		await scrollToBottom();
	}

	async function sendMessage() {
		if (!content.trim()) return;

		if (isNamingNewStash) {
			newStashName = content.trim();
			content = '';
			await handleNameSubmit();
			return;
		}
		messages = [...messages, { role: 'user', content: content.trim() }];
		await scrollToBottom();

		// TODO: Call Convex mutation here, get slug back
		const fakeSlug = Math.random().toString(36).substring(2, 8);

		messages = [
			...messages,
			{
				role: 'yass',
				content: `got it! here's your link:\n\nyass.app/${fakeSlug}\n\ncopied to clipboard 📋`
			}
		];
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
