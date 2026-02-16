import { useState } from 'react'

const TextBlock = ({ data, onChange, preview = false }) => {
  const handleChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value })
    }
  }

  if (preview) {
    if (!data.content) return null

    return (
      <div className="my-6">
        <p className="text-lg leading-relaxed whitespace-pre-line">
          {data.content}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Texto
        </label>
        <textarea
          value={data.content || ''}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Digite seu texto aqui..."
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
        />
        <div className="text-right text-xs text-text-secondary mt-1">
          {data.content?.length || 0} caracteres
        </div>
      </div>

      <div className="text-sm text-text-secondary">
        <p>Dicas:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Use parágrafos curtos para melhor leitura</li>
          <li>Pressione Enter para criar novas linhas</li>
          <li>O texto será formatado automaticamente na visualização</li>
        </ul>
      </div>
    </div>
  )
}

export default TextBlock
