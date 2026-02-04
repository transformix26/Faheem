'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import {
  Send, Plus, User, MoreVertical, Trash2, Tag, Search,
  Phone, Mail, CheckCircle2, AlertCircle, ArrowLeft, Paperclip, Smile
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// --- Types ---

export interface Conversation {
  id: string
  customerId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  channel: 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'web'
  status: 'active' | 'pending' | 'resolved'
  unreadCount: number
  lastMessage: string
  lastMessageTime: string // ISO string or relative time
  tags: string[]
  assignedAgent?: string
}

export interface Message {
  id: string
  conversationId: string
  sender: 'customer' | 'bot' | 'agent'
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  type?: 'text' | 'image' | 'file'
}

// --- Mock Data ---

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'Ahmed Ali',
    customerEmail: 'ahmed@gmail.com',
    channel: 'whatsapp',
    status: 'active',
    unreadCount: 2,
    lastMessage: 'I need help with my order #12345',
    lastMessageTime: '10:30 AM',
    tags: ['Order Issue', 'Urgent']
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'Sarah Smith',
    channel: 'instagram',
    status: 'pending',
    unreadCount: 0,
    lastMessage: 'Is this available in red?',
    lastMessageTime: 'Yesterday',
    tags: ['Inquiry']
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Mohamed Tarek',
    channel: 'web',
    status: 'resolved',
    unreadCount: 0,
    lastMessage: 'Thank you, that solved it!',
    lastMessageTime: '2 days ago',
    tags: ['Technical Support']
  }
]

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', conversationId: '1', sender: 'customer', content: 'Hi, I have a problem.', timestamp: '10:28 AM', status: 'read' },
    { id: 'm2', conversationId: '1', sender: 'bot', content: 'Hello Ahmed! How can I assist you today?', timestamp: '10:29 AM', status: 'read' },
    { id: 'm3', conversationId: '1', sender: 'customer', content: 'I need help with my order #12345', timestamp: '10:30 AM', status: 'read' },
  ]
}

// --- Helper Functions ---

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'whatsapp': return <div className="p-1 bg-green-100 text-green-600 rounded">WA</div>
    case 'messenger': return <div className="p-1 bg-blue-100 text-blue-600 rounded">FB</div>
    case 'instagram': return <div className="p-1 bg-pink-100 text-pink-600 rounded">IG</div>
    default: return <div className="p-1 bg-gray-100 text-gray-600 rounded">WB</div>
  }
}

// --- Components ---

export default function InboxPage() {
  const { t, language } = useLanguage()
  const isRTL = language === 'ar'

  // State
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewConvDialog, setShowNewConvDialog] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => {
    if (selectedId) {
      setMessages(MOCK_MESSAGES[selectedId] || [])
      // Scroll to bottom without page-level jump
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
          if (scrollContainer) {
            scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'instant' })
          }
        }
      }, 50)
    }
  }, [selectedId])

  useEffect(() => {
    if (messages.length > 0) {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (scrollContainer) {
          scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' })
        }
      }
    }
  }, [messages])

  // Handlers
  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedId) return

    const newMsg: Message = {
      id: Date.now().toString(),
      conversationId: selectedId,
      sender: 'agent',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }

    setMessages(prev => [...prev, newMsg])
    setInputText('')

    // Update conversation preview
    setConversations(prev => prev.map(c => c.id === selectedId ? {
      ...c,
      lastMessage: inputText,
      lastMessageTime: 'Now'
    } : c))
  }

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  // Filtered List
  const filteredConversations = conversations.filter(c =>
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConversation = conversations.find(c => c.id === selectedId)

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-4 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* --- Sidebar List --- */}
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`w-full md:w-80 lg:w-96 flex flex-col bg-card border border-border rounded-xl shadow-sm ${selectedId ? 'hidden md:flex' : 'flex'}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{t('inbox.title')}</h2>
          </div>
          <div className="relative">
            <Search className={`absolute top-2.5 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              placeholder={t('inbox.search')}
              className={isRTL ? 'pr-9' : 'pl-9'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>{t('inbox.no_conversations')}</p>
              </div>
            ) : filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors text-start ${selectedId === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
              >
                <Avatar>
                  <AvatarFallback>{conv.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold truncate">{conv.customerName}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getChannelIcon(conv.channel)}
                    {conv.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-1">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </motion.div>

      {/* --- Chat Area --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex-1 flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden ${!selectedId ? 'hidden md:flex' : 'flex'}`}
      >
        {selectedId && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-card z-10">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedId(null)}>
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>
                <Avatar>
                  <AvatarFallback>{activeConversation.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm md:text-base">{activeConversation.customerName}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {t('inbox.active_now')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('inbox.resolve')}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDeleteConversation(selectedId)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('action.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 bg-muted/20 p-4">
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {messages.map((msg, idx) => {
                  const isMe = msg.sender === 'agent'
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={isMe ? 'bg-primary text-white' : 'bg-secondary'}>
                          {isMe ? 'A' : 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl shadow-sm ${isMe
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-white border border-border text-foreground rounded-bl-none'
                          }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
              <div className="max-w-3xl mx-auto flex items-end gap-2">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 bg-muted rounded-xl flex items-center px-4 py-2 gap-2 border border-transparent focus-within:border-primary transition-colors">
                  <input
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm min-h-[24px] max-h-32 resize-none"
                    placeholder={t('inbox.type_message')}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="shrink-0 rounded-xl"
                  size="icon"
                >
                  <Send className={`w-5 h-5 ${isRTL ? '-scale-x-100' : ''}`} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Mail className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('inbox.select_conversation')}</h3>
            <p className="text-sm max-w-xs text-center">{t('inbox.no_conversations_desc')}</p>
          </div>
        )}
      </motion.div>

      {/* --- New Conversation Dialog --- */}
      <Dialog open={showNewConvDialog} onOpenChange={setShowNewConvDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('inbox.new_conversation')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('inbox.name')}</label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('inbox.channel')}</label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">WhatsApp</Button>
                <Button variant="outline" className="flex-1">Website</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewConvDialog(false)}>{t('action.cancel')}</Button>
            <Button onClick={() => setShowNewConvDialog(false)}>{t('action.create')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
