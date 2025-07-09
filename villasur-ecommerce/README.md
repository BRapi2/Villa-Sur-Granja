# VillaSur E-commerce

VillaSur es una plataforma de e-commerce para la venta de productos cárnicos online, lista para producción, containerizada con Docker y con integración de pagos por Yape.

---

## 🚀 Tecnologías
- **Frontend:** React + Vite + Nginx
- **Backend:** Node.js + Express + PostgreSQL
- **Base de datos:** PostgreSQL
- **Containerización:** Docker y Docker Compose
- **Estilos:** CSS Modules

---

## 📁 Estructura del Proyecto
```
villasur-ecommerce/
├── client/           # Frontend React
├── server/           # Backend Node.js/Express
├── docker-compose.yml
└── README.md
```

---

## ⚡ Instalación y Ejecución
**Requisitos:** Tener Docker y Docker Compose instalados.

1. Clona el repositorio y entra a la carpeta raíz:
   ```sh
   git clone <repo-url>
   cd villasur-ecommerce
   ```
2. Levanta todos los servicios:
   ```sh
   docker-compose up --build
   ```
3. Accede a la app:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend/API:** [http://localhost:5000](http://localhost:5000)

---

## 🛒 Guía de Uso para Clientes
- **Registro:** Crea una cuenta desde la página de registro.
- **Catálogo:** Navega y agrega productos al carrito.
- **Carrito:** Edita cantidades y finaliza la compra.
- **Pago:** Al finalizar, escanea el QR de Yape y sube el comprobante.
- **Historial:** Consulta tus pedidos y su estado.
- **Favoritos:** Marca productos como favoritos para encontrarlos fácilmente.

---

## 🛠️ Guía de Uso para Administradores
- **Acceso:** Inicia sesión con el usuario admin:
  - Email: `admin@villasur.com`
  - Contraseña: `admin123`
- **Panel de administración:**
  - Agrega, edita y elimina productos.
  - Visualiza todas las órdenes y comprobantes subidos por los clientes.

---

## 🗄️ Persistencia de archivos
- Los comprobantes de pago subidos por los clientes se guardan en `server/uploads/comprobantes` y se mantienen aunque reinicies los contenedores.

---

## 📝 Documentación de la API
| Endpoint                        | Método | Descripción                                 |
|---------------------------------|--------|---------------------------------------------|
| /api/auth/register              | POST   | Registro de usuario                         |
| /api/auth/login                 | POST   | Login de usuario                            |
| /api/products                   | GET    | Listar productos                            |
| /api/products/:id               | GET    | Detalle de producto                         |
| /api/orders                     | POST   | Crear orden (protegido)                     |
| /api/orders/history             | GET    | Historial de órdenes del usuario (protegido)|
| /api/orders/comprobante         | POST   | Subir comprobante de pago (protegido)       |
| /api/orders/all                 | GET    | Listar todas las órdenes (admin)            |
| /api/favorites                  | GET    | Listar favoritos del usuario (protegido)    |
| /api/favorites                  | POST   | Agregar producto a favoritos (protegido)    |
| /api/favorites/:productId       | DELETE | Quitar producto de favoritos (protegido)    |

---

## 🔒 Seguridad y buenas prácticas
- JWT para autenticación.
- Roles de usuario y admin.
- CORS habilitado.
- Variables sensibles en `.env` (no subas tus credenciales a git).

---

## 📦 Notas de despliegue
- Si usas un servidor real, configura HTTPS en Nginx.
- Puedes mapear la carpeta de uploads para persistencia de archivos.
- Para restaurar la base de datos, edita `server/init.sql`.

---

## 👨‍💻 Autor
Sebastian Aguilar

---

¿Dudas o problemas? ¡Abre un issue o contacta al admin! 