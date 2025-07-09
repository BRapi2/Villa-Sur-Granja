import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.infoRow}>
        <div>
          <strong>Contacto</strong>
          <p>
            Celular: <a href="https://wa.me/51994128083" target="_blank" rel="noopener noreferrer">+51 994 128 083</a>
          </p>
        </div>
        <div>
          <strong>Corporativo</strong>
          <p>Correo: <a href="mailto:ventas@villasur.com">ventas@villasur.com</a></p>
        </div>
      </div>
      <div className={styles.copyRow}>
        <span>© {new Date().getFullYear()} VillaSur | Todos los derechos reservados.</span>
      </div>
    </footer>
  );
} 