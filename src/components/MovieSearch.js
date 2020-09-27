import React, { useState, useCallback } from "react";
import { useSpring, animated } from "react-spring";
import { Container, TextField, List, ListItem } from "@material-ui/core";

import MovieCard from "./MovieCard";

import styles from "../assets/MovieSearch.module.css";

const API_BASE = "https://api.themoviedb.org/3/";
const API_KEY = process.env.REACT_APP_MOVIEDB_API_KEY;
const API_SEARCH = "search/movie?";

let searchTerm = "";
let searchedTerm = "";
let delayTimer;

const MovieSearch = ({ movieSelected, onMovieSelected }) => {
  const [movieResults, setMovieResults] = useState([]);
  // const [movieResults, setMovieResults] = useState([{}, {}, {}]);
  const [focused, setFocused] = useState(true);
  const [searchProps, setSearchProps] = useSpring(() => ({
    marginTop: "200px",
  }));
  const [listProps, setListProps] = useSpring(() => ({}));

  const searchMovie = useCallback(() => {
    if (searchTerm === searchedTerm) return;
    const terms = searchTerm.split().join("+");
    fetch(`${API_BASE}${API_SEARCH}${API_KEY}&query=${terms}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMovieResults(
          data["results"].map((result) => ({
            id: result["id"],
            title: result["title"],
            summary: result["overview"],
            posterPath: result["poster_path"],
          }))
        );
        setSearchProps({
          marginTop: "0px",
        });
        setListProps({
          transform: "translate(0%,0%) scale(1)",
          opacity: 1,
          display: "block",
        });
      });
  }, [setListProps, setSearchProps]);

  const onFocusChange = useCallback(
    (focus) => {
      console.log("focus change")
      setFocused(focus);
      setSearchProps({
        transform: `scale(${focus || !movieSelected ? 1 : 0.75})`,
        marginTop: `${
          !movieSelected && !(focus && movieResults.length) ? 200 : 0
        }px`,
      });

      focus
        ? setListProps({
            transform: "translate(0%,0%) scale(1)",
            opacity: 1,
            display: "block",
          })
        : setListProps({
            to: [
              { transform: "translate(0%,-100%) scale(0.75)", opacity: 0 },
              { display: "none" },
            ],
          });
    },
    [movieResults.length, movieSelected, setListProps, setSearchProps]
  );

  const onSubmitHandler = useCallback(
    (event) => {
      event.preventDefault();
      clearTimeout(delayTimer);
      searchMovie();
    },
    [searchMovie]
  );

  const onChangeHandler = useCallback(
    (event) => {
      searchTerm = event.target.value;
      clearTimeout(delayTimer);
      delayTimer = setTimeout(searchMovie, 1000);
    },
    [searchMovie]
  );

  return (
    <>
      <Container maxWidth="sm">
        <animated.div style={searchProps} className={styles.search}>
          <form onSubmit={onSubmitHandler}>
            <TextField
              fullWidth
              id="movie-search-input"
              variant="outlined"
              label="Search for movies..."
              margin="normal"
              autoComplete="off"
              autoFocus
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
              onChange={onChangeHandler}
              className={styles.searchInput}
            />
          </form>
        </animated.div>
        <animated.div style={listProps} className={styles.list}>
          <List className={styles.list}>
            {movieResults.map((movie) => (
              <ListItem key={movie.id}>
                <MovieCard
                  {...movie}
                  onClickHandler={() => {
                    console.log("click handler")
                    onMovieSelected(movie.id);
                    setSearchProps({ marginTop: "0px", transform: "scale(0.75)" });
                  }}
                />
              </ListItem>
            ))}
          </List>
        </animated.div>
      </Container>
    </>
  );
};

export default MovieSearch;
