import { useState } from 'react'
import { MessageSquare, User, Mail, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const CommentForm = ({ postId, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await onSubmit({
        post_id: postId,
        ...formData
      })
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        content: ''
      })
    } catch (error) {
      // Error is handled in the parent component
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-navy mb-4 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-teal-primary" />
        <span>Deixe seu comentário</span>
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
              Nome *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
                placeholder="Seu nome"
                required
                minLength={2}
                maxLength={100}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              E-mail *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-2">
            Comentário *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none"
            placeholder="Digite seu comentário aqui..."
            required
            minLength={10}
            maxLength={2000}
          />
          <div className="text-right text-xs text-text-secondary mt-1">
            {formData.content.length}/2000 caracteres
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar comentário</span>
            </>
          )}
        </button>

        {/* Notice */}
        <p className="text-xs text-text-secondary">
          * Seu comentário será analisado antes de ser publicado. 
          Limite de 10 comentários por IP a cada 24 horas.
        </p>
      </form>
    </div>
  )
}

export default CommentForm
