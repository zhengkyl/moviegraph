import React, {useCallback, useState} from 'react';
import MovieSearch from './components/MovieSearch'

import styles from "./assets/App.module.css"

function App() {
  const [movie, setMovie] = useState(null);
  const onMovieSelected = useCallback((movieId)=>{
    setMovie(movieId)
  },[])

  return (
    <div className={styles.App}>
      <header className="App-header">
      </header>
      <main>
        <MovieSearch movieSelected={movie} onMovieSelected={onMovieSelected}/>
      </main>
    </div>
  );
}

export default App;
