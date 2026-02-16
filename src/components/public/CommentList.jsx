import { MessageSquare, Calendar, Clock } from 'lucide-react'
import { formatDateTime } from '../../lib/utils'

const CommentList = ({ comments, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-primary"></div>
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">Nenhum comentário ainda</h3>
        <p className="text-text-secondary">
          Seja o primeiro a comentar nesta matéria!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-navy mb-4">
        Comentários ({comments.length})
      </h3>
      
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 bg-teal-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold">
                {comment.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Comment Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-navy">{comment.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-text-secondary">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(comment.created_at)}</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    Publicado
                  </span>
                </div>
              </div>
              
              {/* Comment Text */}
              <div className="text-text-primary leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentList
