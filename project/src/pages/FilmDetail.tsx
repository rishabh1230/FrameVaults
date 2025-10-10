import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Calendar, Award, Play, Star, Users } from 'lucide-react';
import FilmCard from '../components/FilmCard';
import { Film } from '../types/Film';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function getMovieByImdbId(imdbId: string) {
  const url = `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.movie_results && data.movie_results[0]) || null;
}

async function getMovieByTitle(title: string, year?: number) {
  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  const matched = data.results.find((movie: any) => {
    const titleMatches = movie.title.toLowerCase() === title.toLowerCase();
    const yearMatches = year ? new Date(movie.release_date).getFullYear() === year : true;
    return titleMatches && yearMatches;
  });

  return matched || data.results[0];
}

async function getMovieDetails(tmdbId: number) {
  const url = `${TMDB_BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
  const res = await fetch(url);
  return res.json();
}

 const baseFilms = [
      { id: 1, title: "Aaranya Kaandam", criterionNumber: 1, featured: true, year: 2010, imdbId: "tt1496729" },
      { id: 2, title: "Tumbbad", criterionNumber: 2, featured: true, year: 2018, imdbId: "tt8239946" },
      { id: 3, title: "Rocky", criterionNumber: 3, featured: true, year: 1976, imdbId: "tt11772600" },
      { id: 4, title: "Udta Punjab", criterionNumber: 4, year: 2016, imdbId: "tt3952160" },
      { id: 5, title: "Kuruthipunal", criterionNumber: 5, year: 1995, imdbId: "tt0285665" },
      { id: 6, title: "Kumbalangi Nights", criterionNumber: 6, featured: true, year: 2019, imdbId: "tt8413338" },
      { id: 7, title: "Manichitrathazhu", criterionNumber: 7, year: 1993, imdbId: "tt0214915" },
      { id: 8, title: "Trance", criterionNumber: 8, featured: true, year: 2020, imdbId: "tt6720802" },
    ];

const FilmDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [films, setFilms] = useState<Film[] | null>(null);

  useEffect(() => {
    (async () => {
      const loadedFilms: Film[] = [];

      for (const base of baseFilms) {
        let found: any = null;

        if (base.imdbId) {
          found = await getMovieByImdbId(base.imdbId);
        }

        if (!found) {
          found = await getMovieByTitle(base.title, base.year);
        }

        if (!found) continue;

        const details = await getMovieDetails(found.id);

        const directors = details.credits.crew.filter((c: any) => c.job === "Director");
        const directorNames = directors.map((d: any) => d.name).join(', ');

        loadedFilms.push({
          id: base.id,
          title: details.title,
          director: directorNames,
          year: new Date(details.release_date).getFullYear(),
          country: details.production_countries?.[0]?.name || '',
          runtime: details.runtime,
          genre: details.genres.map((g: any) => g.name),
          description: details.overview,
          image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
          criterionNumber: base.criterionNumber,
          awards: [],
          cast: details.credits.cast.slice(0, 4).map((a: any) => a.name),
          format: '',
          language: details.spoken_languages?.[0]?.name || '',
          featured: !!base.featured,
        });
      }

      setFilms(loadedFilms);
    })();
  }, []);

  if (!films) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading films from TMDb...</p>
      </div>
    );
  }

  const film = films.find(f => f.id === parseInt(id || ''));
  
  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white mb-4">Film Not Found</h1>
          <Link to="/films" className="text-yellow-400 hover:text-white transition-colors font-medium">
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const relatedFilms = films
    .filter(f => f.id !== film.id && (
      f.director === film.director || 
      f.genre.some(g => film.genre.includes(g))
    ))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-cinema-bg text-cinema-text-primary">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          to="/films"
          className="inline-flex items-center gap-3 text-cinema-text-secondary hover:text-cinema-accent transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-wide">Back to Collection</span>
        </Link>
      </div>

      {/* Film Header */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Film Poster */}
            <div className="max-w-lg mx-auto lg:mx-0">
              <div className="relative">
                <div className="aspect-[3/4] overflow-hidden bg-cinema-card relative group">
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play Overlay */}
                  {/* <div className="absolute inset-0 bg-cinema-bg bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-cinema-accent text-white p-6 rounded-full">
                      <Play size={32} fill="currentColor" />
                    </div>
                  </div> */}
                </div>
                
                {film.criterionNumber && (
                  <div className="absolute -top-4 -right-4 bg-cinema-accent text-white p-4 font-black text-xl">
                    #{film.criterionNumber}
                  </div>
                )}
              </div>
              <div className="mt-8 text-center">
                <div className="text-lg font-bold text-cinema-text-primary">
                  {film.format}
                </div>
              </div>
            </div>

            {/* Film Info */}
            <div className="space-y-8">
              <div>
                
                <h1 className="text-5xl md:text-6xl font-black text-cinema-text-primary mb-4 leading-none">
                  {film.title}
                </h1>
                <p className="text-2xl text-cinema-text-secondary mb-6">
                  Directed by <span className="text-2xl text-cinema-text-secondary mb-6">{film.director}</span>
                </p>
              </div>

              {/* Film Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Calendar className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold text-cinema-text-primary">{film.year}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Year</div>
                </div>
                <div className="text-center">
                  <Clock className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold text-cinema-text-primary">{film.runtime}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Minutes</div>
                </div>
                <div className="text-center">
                  <Globe className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold text-cinema-text-primary">{film.language}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Language</div>
                </div>
                <div className="text-center">
                  <Users className="mx-auto mb-2 text-cinema-accent" size={24} />
                  <div className="text-lg font-bold text-cinema-text-primary">{film.cast.length}</div>
                  <div className="text-xs text-cinema-text-secondary uppercase tracking-wide">Cast</div>
                </div>
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide text-cinema-text-primary mb-4">Genres</h3>
                <div className="flex flex-wrap gap-3">
                  {film.genre.map(genre => (
                    <span 
                      key={genre}
                      className="bg-cinema-card text-cinema-text-primary px-4 py-2 text-sm font-bold uppercase tracking-wide border-l-4 border-cinema-accent"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Awards */}
              {film.awards && film.awards.length > 0 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wide text-cinema-text-primary mb-4 flex items-center gap-2">
                    <Award className="text-cinema-accent" size={20} />
                    Awards & Recognition
                  </h3>
                  <div className="space-y-2">
                    {film.awards.map(award => (
                      <div key={award} className="flex items-center gap-3">
                        <Star className="text-cinema-accent" size={16} />
                        <span className="text-cinema-text-secondary">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide text-cinema-text-primary mb-4">Synopsis</h3>
                <p className="text-lg text-cinema-text-secondary leading-relaxed">{film.description}</p>
              </div>

              {/* Cast */}
              <div>
                <h3 className="text-lg font-black uppercase tracking-wide text-cinema-text-primary mb-4">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {film.cast.map(actor => (
                    <span 
                      key={actor}
                      className="bg-cinema-card text-cinema-text-secondary px-3 py-1 text-sm"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="bg-cinema-accent text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-cinema-text-primary hover:text-cinema-bg transition-colors flex items-center justify-center">
                  <Play className="mr-2" size={20} />
                  Watch Trailer
                </button>
                <button className="border-2 border-cinema-text-secondary text-cinema-text-primary px-8 py-4 font-bold uppercase tracking-wide hover:border-cinema-accent hover:text-cinema-accent transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Films */}
      {relatedFilms.length > 0 && (
        <section className="py-24 bg-cinema-card">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-cinema-text-primary mb-4">
                RELATED
                <span className="block text-cinema-accent">FILMS</span>
              </h2>
              <div className="w-24 h-1 bg-cinema-accent"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 justify-items-center">
              {relatedFilms.map(relatedFilm => (
                <FilmCard key={relatedFilm.id} film={relatedFilm} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FilmDetail;
