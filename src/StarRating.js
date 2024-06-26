import { useState } from 'react';
import PropTypes from 'prop-types';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle = {
  display: 'flex',
};

StarRating.protoTypes = {
  maxRating: PropTypes.number.isRequired,
  starColor: PropTypes.string,
  textColor: PropTypes.string,
  starSize: PropTypes.number.isRequired,
  textSize: PropTypes.number.isRequired,
  className: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  onSetRating: PropTypes.func,
};

/**
 * A React component that renders a star rating UI with customizable options.
 *
 * @param {object} props - The component props.
 * @param {number} [props.maxRating=5] - The maximum number of stars to display.
 * @param {string} [props.starColor='#ffd83d'] - The color of the filled stars.
 * @param {string} [props.textColor='#ffd83d'] - The color of the rating text.
 * @param {number} [props.starSize=20] - The size of the stars in pixels.
 * @param {number} [props.textSize=20] - The size of the rating text in pixels.
 * @param {string} [props.className=''] - An optional CSS class name to apply to the component.
 * @param {string[]} [props.messages=[]] - An array of messages to display for each rating level.
 * @param {function} [props.onSetRating=() => {}] - A callback function to be called when the rating is set.
 * @returns {JSX.Element} - The rendered star rating component.
 */
export default function StarRating({
  maxRating = 5,
  starColor = '#ffd83d',
  textColor = '#ffd83d',
  starSize = 20,
  textSize = 20,
  className = '',
  messages = [],
  onSetRating = () => {},
}) {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: '1',
    margin: '0',
    color: textColor,
    fontSize: `${textSize}px`,
  };

  function handleRating(rating) {
    setRating(rating);
    onSetRating(rating);
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i + 1}
            onClick={() => handleRating(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onMouseEnter={() => setTempRating(i + 1)}
            onMouseLeave={() => setTempRating(0)}
            starColor={starColor}
            starSize={starSize}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ''}
      </p>
    </div>
  );
}

function Star({ onClick, full, onMouseEnter, onMouseLeave, starColor, starSize }) {
  const starStyle = {
    width: `${starSize}px`,
    height: `${starSize}px`,
    display: 'block',
    cursor: 'pointer',
  };

  return (
    <span
      style={starStyle}
      role='button'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {full ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill={starColor}
          stroke={starColor}
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ) : (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke={starColor}>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='{2}'
            d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
          />
        </svg>
      )}
    </span>
  );
}
