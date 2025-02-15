
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string;
  reading_time: number;
  category: string;
  created_at: string;
}

export const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.reading_time} min de lectura
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
};
