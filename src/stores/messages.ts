import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  listChatChannels,
  getChannelMessages,
  sendChannelMessage,
  listChatConversations,
  getConversationMessages,
  sendConversationMessage,
  type ChatChannel,
  type ChatConversation,
  type ChatMessage,
} from '@/services/api'
import { sha256Hex } from '@/utils/messageHash'

export const useMessagesStore = defineStore('messages', () => {
  const channels = ref<ChatChannel[]>([])
  const conversations = ref<ChatConversation[]>([])
  const messages = ref<(ChatMessage & { _hashOk?: boolean | null })[]>([])
  const activeChannelId = ref<number | null>(null)
  const activeConversationId = ref<number | null>(null)
  const loadingList = ref(false)
  const loadingMessages = ref(false)
  const sending = ref(false)
  const error = ref<string | null>(null)

  const activeChannel = computed<ChatChannel | null>(() =>
    channels.value.find((c) => c.id === activeChannelId.value) ?? null
  )

  const activeConversation = computed<ChatConversation | null>(() =>
    conversations.value.find((c) => c.id === activeConversationId.value) ?? null
  )

  const isDmView = computed<boolean>(
    () => activeConversationId.value != null && activeChannelId.value == null
  )

  async function attachHashVerification(
    list: ChatMessage[]
  ): Promise<(ChatMessage & { _hashOk?: boolean | null })[]> {
    const out: (ChatMessage & { _hashOk?: boolean | null })[] = []
    for (const m of list) {
      let hashOk: boolean | null = null
      if (m.content_hash && m.content) {
        const local = await sha256Hex(m.content)
        hashOk = local === m.content_hash
      }
      out.push({ ...m, _hashOk: hashOk })
    }
    return out
  }

  async function loadChannels() {
    loadingList.value = true
    error.value = null
    try {
      const data = await listChatChannels()
      channels.value = Array.isArray(data?.data) ? data.data : ([] as unknown as ChatChannel[])
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message || 'Failed to load channels'
      channels.value = []
    } finally {
      loadingList.value = false
    }
  }

  async function loadConversations() {
    try {
      const data = await listChatConversations()
      conversations.value = Array.isArray(data?.data)
        ? data.data
        : ([] as unknown as ChatConversation[])
    } catch {
      conversations.value = []
    }
  }

  function selectChannel(id: number) {
    activeChannelId.value = id
    activeConversationId.value = null
    messages.value = []
  }

  function selectConversation(id: number) {
    activeConversationId.value = id
    activeChannelId.value = null
    messages.value = []
  }

  async function openChannel(id: number) {
    selectChannel(id)
    await fetchChannelMessages(id)
  }

  async function openConversation(id: number) {
    selectConversation(id)
    await fetchConversationMessages(id)
  }

  async function fetchMessagesForSelection() {
    if (activeChannelId.value) {
      await fetchChannelMessages(activeChannelId.value)
    } else if (activeConversationId.value) {
      await fetchConversationMessages(activeConversationId.value)
    }
  }

  async function fetchChannelMessages(channelId: number) {
    loadingMessages.value = true
    error.value = null
    try {
      const data = await getChannelMessages(channelId, { per_page: 50 })
      const raw = Array.isArray(data?.data) ? data.data : []
      const chronological = [...raw].reverse()
      messages.value = await attachHashVerification(chronological)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message || 'Failed to load messages'
      messages.value = []
    } finally {
      loadingMessages.value = false
    }
  }

  async function fetchConversationMessages(conversationId: number) {
    loadingMessages.value = true
    error.value = null
    try {
      const data = await getConversationMessages(conversationId, { per_page: 50 })
      const raw = Array.isArray(data?.data) ? data.data : []
      const chronological = [...raw].reverse()
      messages.value = await attachHashVerification(chronological)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message || 'Failed to load messages'
      messages.value = []
    } finally {
      loadingMessages.value = false
    }
  }

  async function sendCurrentMessage(text: string) {
    const body = text.trim()
    if (!body) return

    if (activeChannelId.value) {
      sending.value = true
      error.value = null
      try {
        const created = await sendChannelMessage(activeChannelId.value, body)
        const payload = created.data ?? created
        const withHash = await attachHashVerification([payload as ChatMessage])
        messages.value = [...messages.value, ...withHash]
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        error.value = err.response?.data?.message || 'Failed to send'
      } finally {
        sending.value = false
      }
      return
    }

    if (activeConversationId.value) {
      sending.value = true
      error.value = null
      try {
        const created = await sendConversationMessage(activeConversationId.value, body)
        const payload = created.data ?? created
        const withHash = await attachHashVerification([payload as ChatMessage])
        messages.value = [...messages.value, ...withHash]
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } }
        error.value = err.response?.data?.message || 'Failed to send'
      } finally {
        sending.value = false
      }
    }
  }

  async function bootstrap() {
    await Promise.all([loadChannels(), loadConversations()])
    if (channels.value.length) {
      const first = channels.value[0]
      if (first) await openChannel(first.id)
    } else if (conversations.value.length) {
      const first = conversations.value[0]
      if (first) await openConversation(first.id)
    }
  }

  return {
    channels,
    conversations,
    messages,
    activeChannelId,
    activeConversationId,
    loadingList,
    loadingMessages,
    sending,
    error,
    activeChannel,
    activeConversation,
    isDmView,
    loadChannels,
    loadConversations,
    selectChannel,
    selectConversation,
    openChannel,
    openConversation,
    fetchMessagesForSelection,
    fetchChannelMessages,
    fetchConversationMessages,
    sendCurrentMessage,
    bootstrap,
  }
})
