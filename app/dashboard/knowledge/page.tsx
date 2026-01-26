'use client'

import React from 'react'
import { useState, useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, FileText, Edit2, Trash2, Upload, X, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useBotContext } from '@/lib/bot-context'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  createdAt: string
  fileName?: string
}

const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv']
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt', '.csv']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export default function KnowledgePage() {
  const { t, language } = useLanguage()
  const { activeBot } = useBotContext()
  
  // تحويل معارف الـ Bot إلى قائمة KnowledgeItems
  const initialItems = useMemo(() => {
    if (!activeBot || !activeBot.knowledge.length) {
      return [
        {
          id: '1',
          title: language === 'ar' ? 'التعليمات الرئيسية' : 'Main Instructions',
          description: language === 'ar' ? 'أنت وكيل دعم عملاء ودود مفيد. تساعد العملاء بأسئلتهم وتحل المشاكل.' : 'You are a helpful customer support agent. Help customers with their questions and solve problems.',
          createdAt: '2024-01-20',
        },
        {
          id: '2',
          title: language === 'ar' ? 'سياسة الاسترجاع' : 'Return Policy',
          description: language === 'ar' ? 'سياسة الاسترجاع: 30 يوم ضمان استرجاع المبلغ كاملاً بدون أسئلة.' : 'Return Policy: 30-day money-back guarantee with no questions asked.',
          createdAt: '2024-01-19',
        },
      ]
    }
    return activeBot.knowledge.map((item, idx) => ({
      id: `${idx}`,
      title: item,
      description: `Knowledge item from ${activeBot.name}`,
      createdAt: activeBot.createdAt,
    }))
  }, [activeBot, language])

  const [items, setItems] = useState<KnowledgeItem[]>(initialItems)

  // Update items when bot changes
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems, activeBot])

  const [showForm, setShowForm] = useState(false)
  const [uploadMode, setUploadMode] = useState<'form' | 'upload'>('form')
  const [newItem, setNewItem] = useState({ title: '', description: '' })
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddItem = () => {
    if (newItem.title && newItem.description) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          title: newItem.title,
          description: newItem.description,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ])
      setNewItem({ title: '', description: '' })
      setShowForm(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return t('error.unsupported_file')
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('error.file_too_large')
    }
    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setUploadError(error)
      setUploadedFile(null)
      return
    }
    setUploadError(null)
    setUploadedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUploadFile = () => {
    if (uploadedFile) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          title: uploadedFile.name,
          description: language === 'ar' 
            ? `تم رفع الملف: ${uploadedFile.name}`
            : `File uploaded: ${uploadedFile.name}`,
          createdAt: new Date().toISOString().split('T')[0],
          fileName: uploadedFile.name,
        },
      ])
      setUploadedFile(null)
      setUploadMode('form')
      setShowForm(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('knowledge.title')}
          </h1>
          <p className="text-secondary text-sm md:text-base">
            {t('knowledge.subtitle')}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          {t('knowledge.add_new')}
        </motion.button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-border p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">
              {t('knowledge.add_new')}
            </h2>
            <button
              onClick={() => {
                setShowForm(false)
                setUploadMode('form')
                setUploadedFile(null)
                setUploadError(null)
              }}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => {
                setUploadMode('form')
                setUploadError(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${uploadMode === 'form'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-border'
                }`}
            >
              {t('knowledge.manual_text')}
            </button>
            <button
              onClick={() => {
                setUploadMode('upload')
                setUploadError(null)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm ${uploadMode === 'upload'
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-border'
                }`}
            >
              <Upload className="w-4 h-4" />
              {t('knowledge.upload_file')}
            </button>
          </div>

          {uploadMode === 'form' ? (
            <div className="space-y-4">
              <div>
                <label className="label-text">{t('knowledge.title_label')}</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder={t('knowledge.title_placeholder')}
                />
              </div>
              <div>
                <label className="label-text">{t('knowledge.description_label')}</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
                  placeholder={t('knowledge.description_placeholder')}
                  rows={4}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddItem}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newItem.title || !newItem.description}
                >
                  {t('knowledge.add')}
                </motion.button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
                >
                  {t('knowledge.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-all cursor-pointer ${dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                  }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  animate={{ y: dragActive ? -5 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-secondary'}`} />
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                    {t('knowledge.drag_files')}
                  </h3>
                  <p className="text-sm text-secondary mb-3">
                    {t('knowledge.file_types')}
                  </p>
                </motion.div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.csv"
                  onChange={handleInputChange}
                  className="hidden"
                  aria-label={t('knowledge.upload_file')}
                />
              </div>

              {/* Error Message */}
              {uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </motion.div>
              )}

              {/* File Preview */}
              {uploadedFile && !uploadError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-primary/5 border border-primary rounded-lg flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                    <div className="text-right min-w-0">
                      <p className="font-medium text-foreground truncate text-sm">{uploadedFile.name}</p>
                      <p className="text-sm text-secondary">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null)
                      setUploadError(null)
                    }}
                    className="p-1 hover:bg-primary/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-primary" />
                  </button>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUploadFile}
                  disabled={!uploadedFile || !!uploadError}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {t('knowledge.upload')}
                </motion.button>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setUploadMode('form')
                    setUploadedFile(null)
                    setUploadError(null)
                  }}
                  className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm"
                >
                  {t('knowledge.cancel')}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Knowledge Items List */}
      <div className="grid gap-4">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-border p-8 md:p-12 text-center"
          >
            <FileText className="w-12 md:w-16 h-12 md:h-16 text-muted mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2">
              {t('knowledge.no_knowledge')}
            </h3>
            <p className="text-secondary mb-6 text-sm">
              {t('knowledge.no_knowledge_desc')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              {t('knowledge.add_now')}
            </motion.button>
          </motion.div>
        ) : (
          items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg border border-border p-4 md:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-0">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-1 break-words">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-xs md:text-sm">
                    {new Date(item.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title={t('nav.settings')}
                  >
                    <Edit2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <p className="text-foreground line-clamp-2 text-sm mt-3">{item.description}</p>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
