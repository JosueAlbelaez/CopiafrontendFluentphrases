import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import logo from '@/assets/logo.png';

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  image_url: string;
  reading_time: number;
  category: string;
  created_at: string;
}

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTestPost = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/blog/test');
      console.log('Post de prueba agregado:', response.data);
      fetchPosts();
    } catch (error) {
      console.error('Error al agregar post de prueba:', error);
    }
  };

  useEffect(() => {
    (window as any).addTestBlogPost = addTestPost;
  }, []);

  const categories = Array.from(new Set(posts.map(post => post.category)));

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-6">
      
        

      <div className="relative max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
  {/* Imagen de fondo fija 
  <div
    className="absolute inset-0 bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: "url('https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
    }}
  ></div> */}


<video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-95"
          src="https://videos.pexels.com/video-files/5453622/5453622-sd_640_360_24fps.mp4"
        />

  {/* Capa azul con opacidad */}
  <div className="absolute inset-0 bg-blue-900 opacity-50"></div>

  {/* Contenido */}
  <div className="relative text-center text-white py-32">
   {/*<img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
    <h1 className="text-4xl font-bold mb-4">Blog de FluentPhrases</h1> */}

           <div className="flex justify-center items-center">
              <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
              <Link to="/" className="text-4xl font-bold mb-4 text-red-600">
                Fluent
              </Link>
              <Link to="/" className="text-4xl font-bold mb-4 text-blue-600">
                Phrases
              </Link>
            </div>


    <p className="text-xl text-blue-100">
      Descubre consejos y estrategias para aprender inglés de manera efectiva
    </p>
  </div>
</div>

      </div>
         {/* Back to Home Button */}
         <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="group bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.reading_time} min
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                      <Tag className="w-4 h-4" />
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600">{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};