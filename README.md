# GestiónApp – Examen Final
**Desarrollo de Aplicaciones Web**

Aplicación web SPA construida con Vue.js 3, Bootstrap 5 y MockAPI para gestión de Usuarios y Productos con autenticación y rutas protegidas.

---

## 🚀 Tecnologías

- **Vue.js 3** – Framework frontend reactivo
- **Vue Router 4** – Navegación SPA con navigation guards
- **Bootstrap 5 + Bootstrap Icons** – Diseño responsivo e íconos
- **Axios** – Consumo de API REST
- **MockAPI** – API falsa para datos
- **Vite** – Bundler moderno

---

## ⚙️ Configuración Inicial

### 1. Clona el repositorio
```bash
git clone https://github.com/Josue2025-sistemas/examen-des-app-web
cd examen-des-app-web
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura tu MockAPI
Edita el archivo `src/services/api.js` y reemplaza la URL base:
```js
const BASE_URL = 'https://6a2efd5ec9776ca6c0c530ed.mockapi.io/api'
```

### 4. Estructura esperada en MockAPI

**Recurso `/usuarios`** (campos requeridos):
```json
{
  "id": "1",
  "nombre": "Juan Pérez",
  "username": "juanp",
  "password": "1234",
  "email": "juan@email.com"
}
```

**Recurso `/productos`** (campos requeridos):
```json
{
  "id": "1",
  "nombre": "Laptop Dell",
  "descripcion": "Laptop de alto rendimiento",
  "precio": 1200.00,
  "stock": 10,
  "categoria": "Electrónica"
}
```

### 5. Corre el proyecto
```bash
npm run dev
```
Abre: http://localhost:5173

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── AlertaComponent.vue   # Alerta reutilizable con auto-cierre
├── views/
│   ├── LoginView.vue         # Autenticación con MockAPI
│   ├── UsuariosView.vue      # CRUD completo de usuarios
│   └── ProductosView.vue     # CRUD completo de productos
├── router/
│   └── index.js              # Rutas + navigation guards
├── services/
│   └── api.js                # Servicios Axios para MockAPI
├── App.vue                   # Componente raíz + navbar
└── main.js                   # Punto de entrada
```

---

## 🔐 Autenticación

- El login valida credenciales contra el recurso `/usuarios` de MockAPI
- Al autenticarse se guarda un token simulado en `sessionStorage`
- Las rutas `/usuarios` y `/productos` están protegidas con navigation guards
- El botón "Cerrar Sesión" limpia el `sessionStorage` y redirige al login

---

## ✅ Funcionalidades

| Módulo | Crear | Leer | Editar | Eliminar |
|--------|-------|------|--------|---------|
| Usuarios | ✅ Modal | ✅ Tabla | ✅ Modal | ✅ Modal confirmación |
| Productos | ✅ Modal | ✅ Tarjetas | ✅ Modal | ✅ Modal confirmación |

---

## 👥 Integrantes del Grupo

- Integrante 1: *(gabriel garcia )*
- Integrante 2: *(josue garcia)*
