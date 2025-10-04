### # 📘 API Documentation — The Comfort’s Store 🛋️

**Backend Node.js + Express + MongoDB (Entrega Final)**
Desarrollado por: *Joaquín Alfonso Saavedra Escáriz*
Profesor: *Mauricio Gastón Lúquez - 76525-Backend-I*

---

## Descripción general

Aplicación E-Commerce desarrollada con **Node.js**, **Express**, **Mongoose**, **MongoDB** y **Handlebars**.
Permite gestionar productos, carritos de compra y actualizaciones en tiempo real mediante **Socket.IO**.
La persistencia de datos se realiza en **MongoDB Atlas**, con un esquema normalizado y soft delete.

---

## ⚙️ Tecnologías principales

| Tecnología    | Descripción                               |
| ------------- | ----------------------------------------- |
| Node.js       | Entorno de ejecución del backend          |
| Express       | Framework para enrutamiento y middlewares |
| MongoDB Atlas | Base de datos NoSQL en la nube            |
| Mongoose      | ODM para modelado de datos                |
| Handlebars    | Motor de vistas dinámicas                 |
| Socket.IO     | Comunicación en tiempo real               |
| Postman       | Testing de endpoints REST                 |

---

## 🧩 Estructura principal del proyecto

```
├── public/
|
├── src/
|   ├── config/
|   |   ├── config.js
|   │   ├── database.js
|   │   └── server.js
|   ├── controllers/
|   │   ├── cart.controller.js
|   │   ├── products.controller.js
|   │   └── views.controller.js
|   ├── dao/
|   │   └── managers/
|   │       ├── CartManager.js
|   │       └── ProductManager.js
|   ├── middleware/
|   │   ├── errorHandler.js
|   │   └── validation.js
|   ├── models/
|   │   ├── cartSchema.js
|   │   └── productSchema.js
|   ├── routes/
|   │   ├── api/
|   │   │   ├── carts.router.js
|   │   │   ├── index.js
|   │   │   └── products.router.js
|   │   ├── index.js
|   │   └── views.router.js
|   ├── services/
|   │   └── realTimeService.js
|   ├── views/
|   |   ├── errors/
|   |   ├── layouts/
|   |   ├── pages/
|   |   └── partials/
|   |
|   └── app.js
├── index.js
└── package.json
```

---

## 🧠 Endpoints principales

### 🔹 Productos (`/api/products`)

| Método | Ruta                | Descripción                      | Body esperado                                          | Respuesta                      |
| ------ | ------------------- | -------------------------------- | ------------------------------------------------------ | ------------------------------ |
| GET    | `/api/products`     | Lista todos los productos        | —                                                      | `{ status, docs, totalPages }` |
| GET    | `/api/products/:id` | Obtiene un producto por ID       | —                                                      | `{ status, payload }`          |
| POST   | `/api/products`     | Crea un nuevo producto           | `{ title, description, code, price, stock, category }` | `{ status, payload }`          |
| PUT    | `/api/products/:id` | Actualiza un producto            | Campos a modificar                                     | `{ status, payload }`          |
| DELETE | `/api/products/:id` | Marca un producto como eliminado | —                                                      | `{ status, payload }`          |

---

### 🔹 Carritos (`/api/carts`)

| Método | Ruta                           | Descripción                            | Body esperado  | Respuesta             |
| ------ | ------------------------------ | -------------------------------------- | -------------- | --------------------- |
| POST   | `/api/carts`                   | Crea un carrito vacío                  | —              | `{ status, payload }` |
| GET    | `/api/carts`                   | Lista todos los carritos               | —              | `{ status, payload }` |
| GET    | `/api/carts/:cid`              | Obtiene un carrito por ID              | —              | `{ status, payload }` |
| POST   | `/api/carts/:cid/product/:pid` | Agrega producto al carrito             | `{ quantity }` | `{ status, payload }` |
| DELETE | `/api/carts/:cid/product/:pid` | Elimina un producto del carrito        | —              | `{ status, payload }` |
| DELETE | `/api/carts/:cid`              | Limpia todos los productos del carrito | —              | `{ status, payload }` |

---

## 💬 Rutas de vistas (`/`)

| Ruta                | Descripción                        |
| ------------------- | ---------------------------------- |
| `/`                 | Página principal (Home)            |
| `/login`            | Vista de autenticación             |
| `/products`         | Catálogo general                   |
| `/products/:pid`    | Detalle de producto                |
| `/realtimeproducts` | Gestión de productos con Socket.IO |
| `/carts/:cid`       | Detalle de carrito                 |

---

## ⚗️ Testing con Postman

### 🔸 Configuración

1. Abrir **Postman** → crear una *Collection* llamada “E-Commerce NodeJS”.
2. En “Environments” agregar:

   ```
   base_url = http://localhost:8080
   ```
3. Importar los endpoints de `/api/products` y `/api/carts`.

### 🔸 Smoke test realizado

GET `/api/products` → OK
POST `/api/products` → OK
PUT `/api/products/:id` → OK
DELETE `/api/products/:id` → OK
POST `/api/carts` → OK
POST `/api/carts/:cid/product/:pid` → OK
DELETE `/api/carts/:cid/product/:pid` → OK

> 💡 Resultado: todos los endpoints responden con los códigos esperados (según validación).

---

## 🔌 Socket.IO (Tiempo real)

* Canal de conexión: `/realtimeproducts`
* Eventos implementados:

  * `product:create` → crea producto y emite lista actualizada
  * `product:delete` → marca producto como eliminado
  * `products:update` → broadcast global del estado actual

---

## Errores manejados

| Código | Descripción                                           |
| ------ | ----------------------------------------------------- |
| 400    | Error de validación (`quantity debe ser entero >= 1`) |
| 404    | Recurso no encontrado (`Producto / Carrito`)          |
| 500    | Error interno del servidor (renderizado o DB)         |

Renderizados mediante:

* `views/errors/404.hbs`
* `views/errors/500.hbs`