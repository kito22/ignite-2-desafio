import { useEffect, useState } from 'react';


import { api } from './services/api';

import './styles/global.scss';
import './styles/loader.scss';
import './styles/sidebar.scss';
import './styles/content.scss';
import { Content } from './components/Content';
import { SideBar } from './components/SideBar';
import Loader from './components/Loader';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}


interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [loading, setLoading] = useState<Boolean>(false)

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
    setLoading(false)

  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setLoading(true)
    setTimeout(() => {
      setSelectedGenreId(id)
    }, 2000)
  }

  return (
    <>
    {loading && <Loader />}
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar handleClickButton={handleClickButton} genres={genres} selectedGenreId={selectedGenreId}/>
      <Content selectedGenre={selectedGenre} movies={movies}/>
    </div>
    </>
  )
}