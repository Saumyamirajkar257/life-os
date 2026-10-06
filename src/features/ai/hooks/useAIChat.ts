/**
 * @file useAIChat.ts
 * @description Hook managing AI Chat interactions, message streaming, context inclusion, and conversation persistence.
 * @module AuraAI/Hooks
 */

import { useAIConversationStore } from '../stores/useAIConversationStore';
import { useAIProviderStore } from '../stores/useAIProviderStore';
import { useAIContextStore } from '../stores/useAIContextStore';
import { ProviderAdapter } from '../providers/providerAdapter';
import { ContextGatherer } from '../context/contextGatherer';

export function useAIChat() {
  const {
    conversations,
    activeConversationId,
    isGenerating,
    searchQuery,
    selectedTag,
    setActiveConversationId,
    setSearchQuery,
    setSelectedTag,
    createConversation,
    addMessage,
    updateMessageContent,
    togglePinConversation,
    deleteConversation,
    setGenerating,
  } = useAIConversationStore();

  const { activeProviderId, activeModelId, preferences } = useAIProviderStore();
  const { refreshSnapshot } = useAIContextStore();

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || isGenerating) return;

    let targetConvId = activeConversationId;
    if (!targetConvId) {
      const newC = createConversation(userText.slice(0, 30), activeProviderId, activeModelId);
      targetConvId = newC.id;
    }

    // Add user message
    addMessage(targetConvId, {
      role: 'user',
      content: userText,
    });

    setGenerating(true);

    // Refresh system context
    const snapshot = refreshSnapshot();
    const contextSnapshotStr = preferences.autoContextEnabled
      ? ContextGatherer.formatContextForPrompt(snapshot)
      : '';

    // Create assistant response placeholder
    const assistantMsg = addMessage(targetConvId, {
      role: 'assistant',
      content: 'Thinking...',
      isStreaming: true,
    });

    try {
      const currentMessages = useAIConversationStore
        .getState()
        .conversations.find((c) => c.id === targetConvId)?.messages || [];

      await ProviderAdapter.generateResponse({
        provider: activeProviderId,
        modelId: activeModelId,
        systemPrompt: preferences.systemPrompt,
        messages: currentMessages,
        contextSnapshotStr,
        temperature: preferences.temperature,
        onChunk: (chunk) => {
          updateMessageContent(targetConvId!, assistantMsg.id, chunk);
        },
      });
    } catch (err) {
      updateMessageContent(targetConvId, assistantMsg.id, `⚠️ Error generating response: ${String(err)}`);
    } finally {
      setGenerating(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchQuery = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = selectedTag ? c.tags.includes(selectedTag) : true;
    return matchQuery && matchTag;
  });

  return {
    conversations: filteredConversations,
    activeConversation,
    activeConversationId,
    isGenerating,
    searchQuery,
    selectedTag,
    setActiveConversationId,
    setSearchQuery,
    setSelectedTag,
    createConversation,
    sendMessage,
    togglePinConversation,
    deleteConversation,
  };
}
