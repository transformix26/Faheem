'use client'

import React from 'react'
import { useState, useRef, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, FileText, Trash2, Upload, X, AlertCircle,
  Package, AlignLeft, Calendar, FileType, CheckCircle2, Circle
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog'

// --- Types ---

type KnowledgeType = 'manual' | 'upload' | 'product'

interface ProductData {
  name: string
  description: string
  price: string
  category: string
}

interface KnowledgeItem {
  id: string
  type: KnowledgeType
  title: string
  content?: string // For manual
  productData?: ProductData // For product
  fileName?: string // For upload
  fileSize?: string
  isActive: boolean
  createdAt: string
}

// --- Constants ---

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

// --- Page Component ---

export default function KnowledgePage() {
  const { t, language } = useLanguage()
  const { activeBot } = useBotContext()
  const isRTL = language === 'ar'

  // State
  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      type: 'manual',
      title: isRTL ? 'ترحيب العملاء' : 'Customer Welcome',
      content: isRTL ? 'أهلاً بك في متجرنا! كيف يمكنني مساعدتك اليوم؟' : 'Welcome to our store! How can I help you today?',
      isActive: true,
      createdAt: '2024-01-20',
    },
    {
      id: '2',
      type: 'product',
      title: isRTL ? 'ساعة ذكية X1' : 'Smart Watch X1',
      productData: {
        name: 'Smart Watch X1',
        description: 'Advanced waterproof smart watch with heart rate monitor',
        price: '299 SAR',
        category: 'Electronics'
      },
      isActive: true,
      createdAt: '2024-01-22',
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [activeType, setActiveType] = useState<KnowledgeType>('manual')

  // Form State
  const [manualData, setManualData] = useState({ title: '', content: '' })
  const [productData, setProductData] = useState<ProductData>({ name: '', description: '', price: '', category: '' })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handlers
  const handleAddItem = () => {
    let newItem: KnowledgeItem | null = null
    const base = {
      id: Date.now().toString(),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    }

    if (activeType === 'manual' && manualData.title && manualData.content) {
      newItem = { ...base, type: 'manual', title: manualData.title, content: manualData.content }
      setManualData({ title: '', content: '' })
    } else if (activeType === 'product' && productData.name) {
      newItem = { ...base, type: 'product', title: productData.name, productData }
      setProductData({ name: '', description: '', price: '', category: '' })
    } else if (activeType === 'upload' && uploadedFile) {
      newItem = {
        ...base,
        type: 'upload',
        title: uploadedFile.name,
        fileName: uploadedFile.name,
        fileSize: (uploadedFile.size / 1024 / 1024).toFixed(2) + ' MB'
      }
      setUploadedFile(null)
    }

    if (newItem) {
      setItems([newItem, ...items])
      setShowForm(false)
    }
  }

  const toggleStatus = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item))
  }

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  // File Upload Logic
  const handleFileSelect = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadError(t('knowledge.error.unsupported'))
      setUploadedFile(null)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(t('knowledge.error.too_large'))
      setUploadedFile(null)
      return
    }
    setUploadError(null)
    setUploadedFile(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('knowledge.title')}</h1>
          <p className="text-secondary mt-1">{t('knowledge.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          {t('knowledge.add_new')}
        </Button>
      </div>

      {!activeBot ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-dashed border-border p-12 text-center"
        >
          <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t('sidebar.no_bot')}
          </h3>
          <p className="text-secondary mb-6 max-w-sm mx-auto">
            {t('settings.no_bot_desc')}
          </p>
          <Button variant="default" className="gap-2" onClick={() => window.location.href = '/dashboard/bots/new'}>
            <Plus className="w-4 h-4" />
            {t('sidebar.new_bot')}
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Grid of Knowledge */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white border border-dashed border-border rounded-xl">
                <FileText className="w-16 h-16 text-muted mx-auto mb-4" />
                <h3 className="text-xl font-bold">{t('knowledge.no_knowledge')}</h3>
                <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                  {t('knowledge.add_now')}
                </Button>
              </div>
            ) : items.map(item => (
              <motion.div
                key={item.id}
                layout
                className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col transition-all hover:shadow-md ${!item.isActive ? 'grayscale opacity-70' : 'border-border'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${item.type === 'manual' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'product' ? 'bg-orange-50 text-orange-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                    {item.type === 'manual' ? <AlignLeft className="w-5 h-5" /> :
                      item.type === 'product' ? <Package className="w-5 h-5" /> :
                        <FileType className="w-5 h-5" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isActive}
                      onCheckedChange={() => toggleStatus(item.id)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h3 className={`font-bold text-lg mb-2 truncate ${isRTL ? 'text-right' : 'text-left'}`}>{item.title}</h3>

                <div className="flex-1 space-y-3">
                  {item.type === 'manual' && (
                    <p className={`text-sm text-secondary line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>{item.content}</p>
                  )}

                  {item.type === 'product' && item.productData && (
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <Badge variant="outline" className="mb-1">{item.productData.category}</Badge>
                      <p className="text-sm font-bold text-primary">{item.productData.price}</p>
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">{item.productData.description}</p>
                    </div>
                  )}

                  {item.type === 'upload' && (
                    <div className={`flex items-center gap-2 p-2 bg-muted/30 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <FileText className="w-4 h-4 text-secondary" />
                      <div className={`min-w-0 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <p className="text-xs font-medium truncate">{item.fileName}</p>
                        <p className="text-[10px] text-secondary">{item.fileSize}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-secondary ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-3 h-3" />
                    {item.createdAt}
                  </span>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {t(`knowledge.type.${(item.type === 'upload' ? 'file' : item.type).toLowerCase()}`)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Dialog */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('knowledge.add_new')}</DialogTitle>
                <DialogDescription>
                  {isRTL ? 'اختر النوع وأضف المعلومات المطلوبة' : 'Choose type and add the required information'}
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
                {(['manual', 'upload', 'product'] as KnowledgeType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeType === type ? 'bg-white shadow-sm text-primary' : 'text-secondary hover:text-foreground'
                      }`}
                  >
                    {t(`knowledge.type.${type === 'upload' ? 'file' : type}`)}
                  </button>
                ))}
              </div>

              {activeType === 'manual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.title_label')}</label>
                    <Input
                      value={manualData.title}
                      onChange={e => setManualData({ ...manualData, title: e.target.value })}
                      placeholder={t('knowledge.title_placeholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.content_label')}</label>
                    <Textarea
                      value={manualData.content}
                      onChange={e => setManualData({ ...manualData, content: e.target.value })}
                      placeholder={t('knowledge.content_placeholder')}
                      rows={5}
                    />
                  </div>
                </div>
              )}

              {activeType === 'product' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.product_name')}</label>
                    <Input
                      value={productData.name}
                      onChange={e => setProductData({ ...productData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.price')}</label>
                    <Input
                      value={productData.price}
                      onChange={e => setProductData({ ...productData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.category')}</label>
                    <Input
                      value={productData.category}
                      onChange={e => setProductData({ ...productData, category: e.target.value })}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">{t('knowledge.description')}</label>
                    <Textarea
                      value={productData.description}
                      onChange={e => setProductData({ ...productData, description: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeType === 'upload' && (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-secondary'}`} />
                    <p className="font-bold">{t('knowledge.drag_drop')}</p>
                    <p className="text-xs text-secondary mt-2">{t('knowledge.supported_formats')}</p>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                  </div>

                  {uploadError && <div className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{uploadError}</div>}
                  {uploadedFile && (
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium truncate max-w-[200px]">{uploadedFile.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)}><X className="w-4 h-4" /></Button>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setShowForm(false)}>{t('action.cancel')}</Button>
                <Button onClick={handleAddItem}>{t('knowledge.add')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </motion.div>
  )
}
