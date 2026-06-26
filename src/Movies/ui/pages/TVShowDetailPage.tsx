import { useEffect, useState } from 'react';
import { useParams, Outlet, NavLink } from 'react-router-dom';
import { tmdbService } from '../../../Movies/data/tmdbService';
import { ImageWithFallback } from '../../../Common/ui/components/ImageWithFallback/ImageWithFallback';
import { TVShowDetail, SeasonSummary } from '../../core/movieSchemas';


export const TVShowDetailPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState<TVShowDetail | null>(null);


  useEffect(() => {
    if (id) tmdbService.getTVShowDetail(Number(id)).then(setShow);
  }, [id]);

  if (!show) return <div className="text-white text-center py-20 animate-pulse">Loading Show...</div>;

  return (
    <div className="text-white pb-12">
      <div className="h-auto bg-slate-900 p-8 md:p-12 border-b border-slate-800 flex flex-col md:flex-row gap-8 items-start">
        <ImageWithFallback 
          src={show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : undefined}
          alt={show.name}
          className="w-48 rounded-xl shadow-lg"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{show.name}</h1>
          <p className="text-slate-300 max-w-3xl leading-relaxed mb-6">{show.overview}</p>
          
          {/* THE MISSING SEASON LIST NAVIGATION */}
          <h3 className="text-lg font-bold mb-3 text-slate-400 uppercase tracking-wider">Seasons</h3>
          <div className="flex flex-wrap gap-2">
          {show.seasons
  .filter((s: SeasonSummary) => s.season_number > 0)
  .map((season) => (
    <NavLink
      key={season.id}
      to={`season/${season.season_number}`}
      // ... className
    >
      {season.name || `Season ${season.season_number}`}
    </NavLink>
  ))}
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <Outlet context={{ showId: id }} />
      </div>
    </div>
  );
};