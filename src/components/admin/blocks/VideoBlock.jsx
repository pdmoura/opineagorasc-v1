import { Video, ExternalLink } from 'lucide-react'

const VideoBlock = ({ data, onChange, preview = false }) => {
  const handleChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value })
    }
  }

  const extractYouTubeId = (url) => {
    if (!url) return null

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const getYouTubeEmbedUrl = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}`
  }

  const isValidYouTubeUrl = (url) => {
    return extractYouTubeId(url) !== null
  }

  if (preview) {
    const videoId = extractYouTubeId(data.videoUrl)
    if (!videoId) return null

    return (
      <div className="my-8">
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={getYouTubeEmbedUrl(videoId)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {data.title && (
          <p className="text-center mt-4 text-lg font-medium text-navy">
            {data.title}
          </p>
        )}
      </div>
    )
  }

  const videoId = extractYouTubeId(data.videoUrl)
  const isValid = data.videoUrl && isValidYouTubeUrl(data.videoUrl)

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          URL do Vídeo (YouTube)
        </label>
        <div className="relative">
          <input
            type="url"
            value={data.videoUrl || ''}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
          />
          {data.videoUrl && (
            <a
              href={data.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-primary hover:text-teal-900"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {data.videoUrl && !isValid && (
          <p className="text-sm text-red-500 mt-1">
            URL inválida. Por favor, insira uma URL válida do YouTube.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Título do Vídeo (opcional)
        </label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Digite um título para o vídeo..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
        />
      </div>

      {/* Preview */}
      {isValid && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Visualização
          </label>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={getYouTubeEmbedUrl(videoId)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="text-sm text-text-secondary">
        <p>Dicas:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Cole a URL completa do vídeo do YouTube</li>
          <li>Funciona com URLs do tipo: youtube.com/watch?v=... ou youtu.be/...</li>
          <li>O vídeo será exibido em formato responsivo</li>
        </ul>
      </div>
    </div>
  )
}

export default VideoBlock
