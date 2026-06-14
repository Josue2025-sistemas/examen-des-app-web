import axios from 'axios'

/**
 * =====================================================
 *  IMPORTANTE: Reemplaza esta URL con la de tu MockAPI
 *  Ejemplo: https://67abc123def456.mockapi.io/api/v1
 * =====================================================
 */
const BASE_URL = 'https://6a2efd5ec9776ca6c0c530ed.mockapi.io/api'

// Instancia de Axios configurada con la URL base
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// ──────────────────────────────────────
//  Servicio de Usuarios
// ──────────────────────────────────────
export const usuariosService = {
  /** Obtiene todos los usuarios */
  getAll() {
    return api.get('/usuarios')
  },
  /** Obtiene un usuario por ID */
  getById(id) {
    return api.get(`/usuarios/${id}`)
  },
  /** Crea un nuevo usuario */
  create(data) {
    return api.post('/usuarios', data)
  },
  /** Edita un usuario existente */
  update(id, data) {
    return api.put(`/usuarios/${id}`, data)
  },
  /** Elimina un usuario */
  delete(id) {
    return api.delete(`/usuarios/${id}`)
  }
}

// ──────────────────────────────────────
//  Servicio de Productos
// ──────────────────────────────────────
export const productosService = {
  /** Obtiene todos los productos */
  getAll() {
    return api.get('/productos')
  },
  /** Crea un nuevo producto */
  create(data) {
    return api.post('/productos', data)
  },
  /** Edita un producto existente */
  update(id, data) {
    return api.put(`/productos/${id}`, data)
  },
  /** Elimina un producto */
  delete(id) {
    return api.delete(`/productos/${id}`)
  }
}
