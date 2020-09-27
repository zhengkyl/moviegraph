import React, { useState, useCallback } from "react";
import {
  ButtonBase,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  TextField,
  List,
  ListItem,
} from "@material-ui/core";
import fallbackImg from "../assets/img/fallbackImg.jpg";

import styles from "../assets/MovieCard.module.css";

const BASE_URL = "https://image.tmdb.org/t/p/";
const IMAGE_QUALITY = "w342";

const MovieCard = ({ id, title, summary, posterPath, onClickHandler }) => {
  title = title ? title : "No Title Available";
  summary = summary ? summary : "No Summary Available";

  return (
    <ButtonBase className={styles.button} onMouseDown={onClickHandler}>
      <Card className={styles.card}>
        <CardMedia className={styles.cardMedia}>
          <img
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
            style={{ width: "auto", height: "100%" }}
            alt="Poster"
            src={`${BASE_URL}${IMAGE_QUALITY}${posterPath}`}
          />
        </CardMedia>
        <CardContent>
          <Typography variant="h5" component="span">
            {title}
          </Typography>
          <Typography paragraph variant="body2">
            {summary.length > 250
              ? `${summary.substring(0, 250).trim()}...`
              : summary}
          </Typography>
        </CardContent>
      </Card>
    </ButtonBase>
  );
};

export default MovieCard;
