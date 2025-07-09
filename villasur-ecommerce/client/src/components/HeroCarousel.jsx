import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';
import polloImg from '../assets/polloPortada.png';
import resImg from '../assets/resPortada.jpg';
import huevosImg from '../assets/huevoPortada.jpg';

const slides = [
  {
    image: polloImg,
    text: 'Pollo de campo, libre de hormonas',
  },
  {
    image: resImg,
    text: 'Res de libre pastoreo',
  },
  {
    image: huevosImg,
    text: 'Huevos frescos de corral',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`hero-slide${idx === current ? ' active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {idx === current && (
            <div className="hero-content">
              <h2>{slide.text}</h2>
            </div>
          )}
        </div>
      ))}
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={idx === current ? 'active' : ''}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
} 