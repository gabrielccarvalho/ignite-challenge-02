import React from 'react'
import { api } from '../services/api';
import { Button } from '../components/Button';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

type Props = {
  genres: GenreResponseProps[],
  setGenres: React.Dispatch<React.SetStateAction<GenreResponseProps[]>>,
  setMovies: React.Dispatch<React.SetStateAction<MovieProps[]>>,
  setSelectedGenre: React.Dispatch<React.SetStateAction<GenreResponseProps>>,
}

export function SideBar (props: Props) {
  const [selectedGenreId, setSelectedGenreId] = React.useState(1);

  React.useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      props.setGenres(response.data);
    });
  }, []);

  React.useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      props.setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      props.setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <nav className="sidebar">
    <span>Watch<p>Me</p></span>

    <div className="buttons-container">
      {props.genres.map(genre => (
        <Button
          key={String(genre.id)}
          title={genre.title}
          iconName={genre.name}
          onClick={() => handleClickButton(genre.id)}
          selected={selectedGenreId === genre.id}
        />
      ))}
    </div>

  </nav>
  )
}