import { useState } from "react";
import PropTypes from "prop-types";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",

  justifyContent: "center",
};

const starStyle = {
  cursor: "pointer",
};

StarRater.propTypes = {
  maxStars: PropTypes.number.isRequired,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
};

export default function StarRater({
  maxStars = 5,
  color = "#fcc419",
  sizePixels = 30,
  classname = "",
  messages = [],
  defaultRating = 0,
  onSetRating, //no default
}) {
  const [rating, setRating] = useState(defaultRating);
  const [hoverRating, setHoverRating] = useState(0);

  function onRating(r) {
    setRating(r);
    if (onSetRating !== null) onSetRating(r);
  }

  const textStyle = {
    margin: "0",
    marginLeft: sizePixels * 0.1,
    marginTop: sizePixels * 0.1,
    fontSize: `${sizePixels}px`,
    color: color,
    // if prop had been named color we could simply have
    // written color rather than color: color
    fontWeight: "bold",
    display: "flex",
  };

  const starContainerStyle = {
    display: "flex",
    gap: "1px",
    fontSize: `${sizePixels * 1.2}px`,
    color: color,
  };

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxStars }, (_, i) => {
          return (
            <Star
              rating={rating}
              full={hoverRating ? hoverRating >= i + 1 : rating >= i + 1}
              key={i}
              onRate={() => onRating(i + 1)}
              onHoverIn={() => setHoverRating(i + 1)}
              onHoverOut={() => setHoverRating(0)}
            />
          );
        })}
      </div>
      <div style={textStyle} className={classname}>
        {/* hoverRating: {hoverRating}, rating: {rating}
        <br /> */}
        {hoverRating || rating || ""}
        {"  "}
        {messages.length === maxStars &&
          messages[hoverRating ? hoverRating - 1 : rating - 1]}
      </div>
    </div>
  );
  //rating={rating} index={i} onStarClick={setRating(i)}
}

function Star({ rating, full, onRate, onHoverIn, onHoverOut }) {
  //console.log("rating=" + rating + ", index=" + index);
  return (
    <span
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? "★" : "☆"}
    </span>
  );
}
