import React, { useState, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  TextField,
  List,
  ListItem,
} from "@material-ui/core";

import MovieCard from "./MovieCard"

import styles from "../assets/MovieSearch.module.css";

const API_BASE = "https://api.themoviedb.org/3/";
const API_KEY = process.env.REACT_APP_MOVIEDB_API_KEY;
const API_SEARCH = "search/movie?";

let searchTerm="";
let searchedTerm="";
let delayTimer;

const searchMovie = (setMovieResults) => {
  if (searchTerm === searchedTerm) return;
  console.log("searhin")
  const terms = searchTerm.split().join("+")
  fetch(`${API_BASE}${API_SEARCH}${API_KEY}&query=${terms}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setMovieResults(
        data["results"].map((result) => ({
          id: result["id"],
          title: result["title"],
          summary: result["overview"],
          posterPath: result["poster_path"],
        }))
      );
    });
};



const MovieSearch = () => {
  const [movieResults, setMovieResults] = useState([{},{},{}]);
  const [focused, setFocused] = useState(true);

  const [springProps, setSpringProps] = useSpring(() => ({
    transform: "scale(1)",
  }));
  const onFocusChange = useCallback(
    (focus) => {
      setFocused(focus);
      setSpringProps({
        transform: `scale(${focus || !movieResults.length ? 1 : 0.75})`,
      });
    },
    [movieResults.length, setSpringProps]
  );

  const onSubmitHandler = useCallback((event) => {
    event.preventDefault();
    searchMovie(setMovieResults);
    // setMovieResults();
  }, []);

  const onChangeHandler = useCallback((event) => {
    searchTerm = event.target.value;
    clearTimeout(delayTimer);
    delayTimer = setTimeout(()=>searchMovie(setMovieResults), 1000);
    // console.log("change")
  }, []);

  return (
    <>
        <Container maxWidth="sm">
      <animated.div style={springProps}>
          <form onSubmit={onSubmitHandler}>
            <TextField
              fullWidth
              id="movie-search-input"
              variant="outlined"
              label="Search for movies..."
              margin="normal"
              autoFocus
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              onChange={onChangeHandler}
              // className={styles.searchInput}
            />
          </form>
            </animated.div>
          <List>
            {movieResults.map((movie)=>(
              <ListItem key={movie.id}>
                <MovieCard {...movie}/>
              </ListItem>
            ))}

          </List>
        </Container>
    </>
  );
};

export default MovieSearch;
