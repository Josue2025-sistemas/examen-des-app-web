<template>
  <div class="container-fluid py-4 px-3 px-md-4">
    <div class="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
      <div>
        <h2 class="fw-bold mb-0">
          <i class="bi bi-box-seam-fill me-2"></i>Productos
        </h2>
        <p class="text-muted small mt-2 mb-0">
          {{ productos.length }} producto(s) disponible(s)
        </p>
      </div>
      <button class="btn btn-primary btn-lg" @click="abrirModalCrear">
        <i class="bi bi-plus-circle-fill me-2"></i>Nuevo Producto
      </button>
    </div>

    <AlertaComponent
      v-if="alerta.visible"
      :tipo="alerta.tipo"
      :mensaje="alerta.mensaje"
      @cerrar="alerta.visible = false"
    />

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-muted">Cargando productos...</p>
    </div>

    <div v-else>
      <div v-if="productos.length === 0" class="text-center py-5 text-muted">
        <i class="bi bi-inbox fs-1 d-block mb-2"></i>
        <p>No hay productos registrados. ¡Crea el primero!</p>
      </div>

      <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <div v-for="producto in productos" :key="producto.id" class="col">
          <div class="card h-100 d-flex flex-column overflow-hidden shadow-sm">
            <div class="card-img-top bg-light overflow-hidden d-flex align-items-center justify-content-center">
              <img
                :src="producto.imagen || placeholderImage"
                :alt="producto.nombre"
                class="w-100 h-100 product-image"
                @error="onImageError"
              />
            </div>
            <div class="card-body d-flex flex-column flex-grow-1">
              <h6 class="card-title fw-bold mb-2">{{ producto.nombre }}</h6>
              <p class="card-text text-muted small mb-3 flex-grow-1">{{ producto.descripcion }}</p>
              <div class="mb-2">
                <span class="badge bg-primary rounded-pill">
                  {{ producto.categoria }}
                </span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="fw-bold text-success fs-5">
                  ${{ formatPrecio(producto.precio) }}
                </span>
                <span class="badge bg-secondary">
                  Stock: {{ producto.stock }}
                </span>
              </div>
            </div>
            <div class="card-footer bg-light border-0 p-2 d-flex gap-2">
              <button
                class="btn btn-outline-warning btn-sm flex-fill"
                @click="abrirModalEditar(producto)"
              >
                <i class="bi bi-pencil-fill me-1"></i>Editar
              </button>
              <button
                class="btn btn-outline-danger btn-sm flex-fill"
                @click="abrirModalEliminar(producto)"
              >
                <i class="bi bi-trash3-fill me-1"></i>Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CREAR PRODUCTO -->
    <div class="modal fade" id="modalCrearProducto" tabindex="-1" ref="modalCrear">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-gradient border-0 rounded-top-4">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-plus-circle-fill me-2"></i>Crear Nuevo Producto
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Nombre del producto *</label>
                <input v-model="formProducto.nombre" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.nombre }" placeholder="Ej: Laptop Dell XPS" />
                <div class="invalid-feedback">El nombre es obligatorio.</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descripción</label>
                <textarea v-model="formProducto.descripcion" class="form-control futuristic-input" rows="2"
                  placeholder="Breve descripción del producto"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">URL de imagen *</label>
                <input v-model="formProducto.imagen" type="url" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.imagen }" placeholder="https://ejemplo.com/imagen.jpg" />
                <div class="invalid-feedback" v-if="errores.imagen">Ingresa una URL de imagen válida.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Precio *</label>
                <div class="input-group">
                  <span class="input-group-text bg-dark border border-cyan text-light">$</span>
                  <input v-model.number="formProducto.precio" type="number" class="form-control futuristic-input"
                    :class="{ 'is-invalid': errores.precio }" placeholder="0.00" min="0" step="0.01" />
                </div>
                <div class="invalid-feedback" v-if="errores.precio">Ingresa un precio válido.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Stock *</label>
                <input v-model.number="formProducto.stock" type="number" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.stock }" placeholder="0" min="0" />
                <div class="invalid-feedback">Ingresa una cantidad válida.</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Categoría</label>
                <select v-model="formProducto.categoria" class="form-select futuristic-input">
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-primary futuristic-btn" @click="crearProducto" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR PRODUCTO -->
    <div class="modal fade" id="modalEditarProducto" tabindex="-1" ref="modalEditar">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-warning text-dark rounded-top-4 border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-pencil-square me-2"></i>Editar Producto
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Nombre del producto *</label>
                <input v-model="formProducto.nombre" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.nombre }" />
                <div class="invalid-feedback">El nombre es obligatorio.</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Descripción</label>
                <textarea v-model="formProducto.descripcion" class="form-control futuristic-input" rows="2"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">URL de imagen *</label>
                <input v-model="formProducto.imagen" type="url" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.imagen }" placeholder="https://ejemplo.com/imagen.jpg" />
                <div class="invalid-feedback" v-if="errores.imagen">Ingresa una URL de imagen válida.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Precio *</label>
                <div class="input-group">
                  <span class="input-group-text bg-dark border border-cyan text-light">$</span>
                  <input v-model.number="formProducto.precio" type="number" class="form-control futuristic-input"
                    :class="{ 'is-invalid': errores.precio }" min="0" step="0.01" />
                </div>
                <div class="invalid-feedback" v-if="errores.precio">Ingresa un precio válido.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Stock *</label>
                <input v-model.number="formProducto.stock" type="number" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.stock }" min="0" />
                <div class="invalid-feedback">Ingresa una cantidad válida.</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Categoría</label>
                <select v-model="formProducto.categoria" class="form-select futuristic-input">
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-warning futuristic-btn" @click="editarProducto" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL ELIMINAR PRODUCTO -->
    <div class="modal fade" id="modalEliminarProducto" tabindex="-1" ref="modalEliminar">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-danger text-white rounded-top-4 border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-box-seam text-danger fs-1 d-block mb-3"></i>
            <p class="mb-1">¿Estás seguro de eliminar el producto</p>
            <strong>{{ productoSeleccionado?.nombre }}</strong>?
            <p class="text-muted small mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="eliminarProducto" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span></span>
              <span v-else><i class="bi bi-trash3-fill me-1"></i>Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { Modal } = window.bootstrap
import { productosService } from '../services/api.js'
import AlertaComponent from '../components/AlertaComponent.vue'

export default {
  name: 'ProductosView',
  components: { AlertaComponent },
  data() {
    return {
      productos: [],
      loading: true,
      guardando: false,
      productoSeleccionado: null,
      formProducto: { nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Electrónica', imagen: '' },
      placeholderImage: 'https://via.placeholder.com/400x300?text=Sin+Imagen',
      errores: {},
      alerta: { visible: false, tipo: 'success', mensaje: '' },
      bsModalCrear: null,
      bsModalEditar: null,
      bsModalEliminar: null
    }
  },
  mounted() {
    this.bsModalCrear = new Modal(this.$refs.modalCrear)
    this.bsModalEditar = new Modal(this.$refs.modalEditar)
    this.bsModalEliminar = new Modal(this.$refs.modalEliminar)
    this.cargarProductos()
  },
  methods: {
    async cargarProductos() {
      this.loading = true
      try {
        const res = await productosService.getAll()
        this.productos = res.data
      } catch {
        this.mostrarAlerta('danger', 'Error al cargar productos. Verifica la API.')
      } finally {
        this.loading = false
      }
    },

    validarForm() {
      this.errores = {}
      if (!String(this.formProducto.nombre || '').trim()) this.errores.nombre = true
      const imagenValue = String(this.formProducto.imagen || '').trim()
      if (!imagenValue || !this.esUrlValida(imagenValue)) this.errores.imagen = true
      if (!this.formProducto.precio || this.formProducto.precio < 0) this.errores.precio = true
      if (this.formProducto.stock === '' || this.formProducto.stock < 0) this.errores.stock = true
      return Object.keys(this.errores).length === 0
    },

    abrirModalCrear() {
      this.formProducto = { nombre: '', descripcion: '', precio: '', stock: '', categoria: 'Electrónica', imagen: '' }
      this.errores = {}
      this.bsModalCrear.show()
    },

    abrirModalEditar(producto) {
      this.productoSeleccionado = producto
      this.formProducto = { ...producto, imagen: producto.imagen || '' }
      this.errores = {}
      this.bsModalEditar.show()
    },

    abrirModalEliminar(producto) {
      this.productoSeleccionado = producto
      this.bsModalEliminar.show()
    },

    async crearProducto() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await productosService.create(this.formProducto)
        this.bsModalCrear.hide()
        await this.cargarProductos()
        this.mostrarAlerta('success', `Producto "${this.formProducto.nombre}" creado correctamente.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al crear el producto.')
      } finally {
        this.guardando = false
      }
    },

    async editarProducto() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await productosService.update(this.productoSeleccionado.id, this.formProducto)
        this.bsModalEditar.hide()
        await this.cargarProductos()
        this.mostrarAlerta('warning', `Producto "${this.formProducto.nombre}" actualizado.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al editar el producto.')
      } finally {
        this.guardando = false
      }
    },

    async eliminarProducto() {
      this.guardando = true
      try {
        await productosService.delete(this.productoSeleccionado.id)
        this.bsModalEliminar.hide()
        await this.cargarProductos()
        this.mostrarAlerta('danger', `Producto "${this.productoSeleccionado.nombre}" eliminado.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al eliminar el producto.')
      } finally {
        this.guardando = false
      }
    },

    mostrarAlerta(tipo, mensaje) {
      this.alerta = { visible: true, tipo, mensaje }
    },

    esUrlValida(url) {
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    },

    onImageError(event) {
      event.target.src = this.placeholderImage
    },

    formatPrecio(precio) {
      return Number(precio).toFixed(2)
    }
  }
}
</script>
