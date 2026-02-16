import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building, 
  TreePine, 
  Coffee,
  Info,
  Newspaper,
  Heart
} from 'lucide-react';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/public/PostCard';

const Concordia = () => {
  const { posts, loading } = usePosts();
  const [concordiaPosts, setConcordiaPosts] = useState([]);

  useEffect(() => {
    if (posts.length > 0) {
      // Filtrar posts que mencionam Concórdia em todas as variações
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes('concórdia') ||
        post.title.toLowerCase().includes('concordia') ||
        post.title.toLowerCase().includes('concórdia') ||
        post.excerpt.toLowerCase().includes('concórdia') ||
        post.excerpt.toLowerCase().includes('concordia') ||
        post.excerpt.toLowerCase().includes('concórdia') ||
        post.content?.toLowerCase().includes('concórdia') ||
        post.content?.toLowerCase().includes('concordia') ||
        post.content?.toLowerCase().includes('concórdia') ||
        // Tags e categorias
        post.category?.toLowerCase().includes('concórdia') ||
        post.category?.toLowerCase().includes('concordia') ||
        post.category?.toLowerCase().includes('concórdia') ||
        post.tags?.some(tag => 
          tag.toLowerCase().includes('concórdia') || 
          tag.toLowerCase().includes('concordia') || 
          tag.toLowerCase().includes('concórdia')
        )
      );
      setConcordiaPosts(filtered);
    }
  }, [posts]);

  const curiosidades = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Localização Estratégica",
      description: "Concórdia está localizada no oeste de Santa Catarina, conhecida como o 'Coração do Oeste Catarinense'."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "População",
      description: "Com aproximadamente 80 mil habitantes, é um dos principais polos econômicos da região."
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Economia",
      description: "Destaque na agroindústria, com empresas como Sadia e Perdigão que marcaram a história do município."
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Cultura do Café",
      description: "Tradicional na produção de café, sendo reconhecida pela qualidade dos grãos produzidos na região."
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Natureza",
      description: "Rica em recursos naturais, com belas paisagens e áreas de preservação ambiental."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "História",
      description: "Fundada em 1934, tem uma história rica marcada pela colonização italiana e alemã."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-primary to-teal-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Concórdia - SC
            </h1>
            <p className="text-xl md:text-3xl font-bold mb-8 text-white">
              O coração do oeste catarinense
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">Oeste de Santa Catarina</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Users className="w-5 h-5" />
                <span className="font-semibold">~80 mil habitantes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Fundada em 1934</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre Concórdia */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-navy mb-4">
              Sobre Concórdia
            </h2>
            <p className="text-xl font-bold text-gray-800 max-w-3xl mx-auto">
              Concórdia é um município brasileiro do estado de Santa Catarina, 
              localizado na mesorregião do Oeste Catarinense. Conhecida por sua 
              forte economia agroindustrial e rica cultura, a cidade é um importante 
              polo regional de desenvolvimento.
            </p>
          </div>

          {/* Curiosidades em Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {curiosidades.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-teal-primary bg-teal-50 p-3 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-800 font-medium text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notícias sobre Concórdia */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Newspaper className="w-8 h-8 text-teal-primary" />
                <h2 className="text-3xl md:text-5xl font-black text-navy">
                  Notícias de Concórdia
                </h2>
              </div>
              <p className="text-xl font-bold text-gray-800">
                Acompanhe as últimas notícias e acontecimentos da cidade
              </p>
            </div>

            {concordiaPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {concordiaPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">
                  Nenhuma notícia sobre Concórdia encontrada
                </h3>
                <p className="text-gray-800 font-medium mb-6">
                  Em breve traremos as últimas notícias da cidade
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors font-bold"
                >
                  <span>Voltar para Home</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-8 h-8 text-orange-warm" />
              <h2 className="text-3xl md:text-5xl font-black text-navy">
                Orgulho de ser Concórdiense
              </h2>
            </div>
            <p className="text-xl font-bold text-gray-800 mb-8">
              Concórdia é mais que uma cidade, é uma comunidade vibrante 
              com gente trabalhadora, cultura rica e futuro promissor.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/categoria/concordia"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-primary text-white rounded-lg hover:bg-teal-900 transition-colors font-bold"
              >
                <Newspaper className="w-5 h-5" />
                <span>Mais Notícias</span>
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-teal-primary text-teal-primary rounded-lg hover:bg-teal-primary hover:text-white transition-colors font-bold"
              >
                <Info className="w-5 h-5" />
                <span>Entre em Contato</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concordia;
