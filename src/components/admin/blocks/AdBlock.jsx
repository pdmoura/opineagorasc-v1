import { Code, Megaphone } from 'lucide-react'

const AdBlock = ({ data, onChange, preview = false }) => {
  const handleChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value })
    }
  }

  if (preview) {
    if (!data.code) return null

    return (
      <div className="my-8">
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <div dangerouslySetInnerHTML={{ __html: data.code }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Tipo de Anúncio
        </label>
        <select
          value={data.type || 'adsense'}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
        >
          <option value="adsense">Google AdSense</option>
          <option value="custom">Código Personalizado</option>
          <option value="affiliate">Afiliado</option>
          <option value="banner">Banner Simples</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-navy mb-2">
          Código do Anúncio
        </label>
        <div className="relative">
          <Code className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
          <textarea
            value={data.code || ''}
            onChange={(e) => handleChange('code', e.target.value)}
            placeholder={`<!-- Cole o código do anúncio aqui -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
            rows={8}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent resize-none font-mono text-sm"
          />
        </div>
        <div className="text-right text-xs text-text-secondary mt-1">
          {data.code?.length || 0} caracteres
        </div>
      </div>

      {/* Preview */}
      {data.code && (
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Visualização
          </label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-center text-text-secondary mb-2">
              <Megaphone className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Área do Anúncio</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded p-4 min-h-[100px] flex items-center justify-center">
              <span className="text-xs text-text-secondary">
                O código do anúncio será renderizado aqui
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-text-secondary">
        <p>Dicas:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Cole o código completo do AdSense ou outra rede de anúncios</li>
          <li>Para banners simples, você pode usar tags HTML básicas</li>
          <li>Teste o código antes de publicar para garantir que funcione corretamente</li>
          <li>Respeite as políticas das redes de anúncios</li>
        </ul>
      </div>

      {/* Exemplos de código */}
      <div className="text-sm text-text-secondary">
        <p className="font-medium mb-2">Exemplos:</p>
        <div className="space-y-2">
          <details className="bg-gray-50 rounded p-3">
            <summary className="cursor-pointer font-medium">Banner Simples</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
{`<a href="https://exemplo.com" target="_blank">
  <img src="https://exemplo.com/banner.jpg" alt="Banner" />
</a>`}
            </pre>
          </details>
          
          <details className="bg-gray-50 rounded p-3">
            <summary className="cursor-pointer font-medium">HTML Personalizado</summary>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
{`<div class="ad-banner">
  <h3>Patrocinado</h3>
  <p>Conteúdo do anúncio aqui</p>
  <a href="#" class="cta-button">Saiba mais</a>
</div>`}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}

export default AdBlock
