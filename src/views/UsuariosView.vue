<template>
  <div class="container-fluid py-4 px-3 px-md-4">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
        <div>
          <h2 class="fw-bold mb-0">
            <i class="bi bi-people-fill me-2"></i>Usuarios
          </h2>
          <p class="text-muted small mt-2 mb-0">Gestiona los usuarios registrados en la aplicación</p>
        </div>
        <button class="btn btn-primary btn-lg" @click="abrirModalCrear">
          <i class="bi bi-person-plus-fill me-2"></i>Nuevo Usuario
        </button>
      </div>

      <!-- Alerta de retroalimentación -->
      <AlertaComponent
        v-if="alerta.visible"
        :tipo="alerta.tipo"
        :mensaje="alerta.mensaje"
        @cerrar="alerta.visible = false"
      />

      <!-- Spinner de carga -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Cargando usuarios...</p>
      </div>

      <!-- Tabla de usuarios -->
      <div v-else class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary">
              <tr>
                <th class="ps-4">#</th>
                <th>Nombre</th>
                <th>Username</th>
                <th class="d-none d-md-table-cell">Email</th>
                <th class="text-center pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-3 d-block mb-2"></i>No hay usuarios registrados
                </td>
              </tr>
              <tr v-for="(usuario, index) in usuarios" :key="usuario.id">
                <td class="ps-4 text-muted">{{ index + 1 }}</td>
                <td class="fw-semibold">
                  <i class="bi bi-person-circle me-2"></i>{{ usuario.nombre }}
                </td>
                <td><span class="badge bg-secondary">@{{ usuario.username }}</span></td>
                <td class="text-muted d-none d-md-table-cell">{{ usuario.email }}</td>
                <td class="text-center pe-4">
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      class="btn btn-outline-warning me-1"
                      @click="abrirModalEditar(usuario)"
                      title="Editar usuario"
                    >
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="abrirModalEliminar(usuario)"
                      title="Eliminar usuario"
                    >
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    <!-- ───── MODAL CREAR USUARIO ───── -->
    <div class="modal fade" id="modalCrearUsuario" tabindex="-1" ref="modalCrear">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-gradient border-0 rounded-top-4">
            <h5 class="modal-title text-white fw-bold">
              <i class="bi bi-person-plus-fill me-2"></i>Crear Nuevo Usuario
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nombre completo *</label>
                <input v-model="formUsuario.nombre" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.nombre }" placeholder="Ej: Ana García" />
                <div class="invalid-feedback">El nombre es obligatorio.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Username *</label>
                <input v-model="formUsuario.username" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.username }" placeholder="Ej: ana123" />
                <div class="invalid-feedback">El username es obligatorio.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Contraseña *</label>
                <input v-model="formUsuario.password" type="password" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.password }" placeholder="Mínimo 4 caracteres" />
                <div class="invalid-feedback">La contraseña es obligatoria.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Email *</label>
                <input v-model="formUsuario.email" type="email" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.email }" placeholder="correo@ejemplo.com" />
                <div class="invalid-feedback">Ingresa un email válido.</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-primary futuristic-btn" @click="crearUsuario" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ───── MODAL EDITAR USUARIO ───── -->
    <div class="modal fade" id="modalEditarUsuario" tabindex="-1" ref="modalEditar">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-warning text-dark rounded-top-4 border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-pencil-square me-2"></i>Editar Usuario
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nombre completo *</label>
                <input v-model="formUsuario.nombre" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.nombre }" />
                <div class="invalid-feedback">El nombre es obligatorio.</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Username *</label>
                <input v-model="formUsuario.username" type="text" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.username }" />
                <div class="invalid-feedback">El username es obligatorio.</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Email *</label>
                <input v-model="formUsuario.email" type="email" class="form-control futuristic-input"
                  :class="{ 'is-invalid': errores.email }" />
                <div class="invalid-feedback">Ingresa un email válido.</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-warning futuristic-btn" @click="editarUsuario" :disabled="guardando">
              <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
              <span v-else><i class="bi bi-check-lg me-1"></i>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ───── MODAL ELIMINAR USUARIO ───── -->
    <div class="modal fade" id="modalEliminarUsuario" tabindex="-1" ref="modalEliminar">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content glass-modal rounded-4 border-0">
          <div class="modal-header bg-danger text-white rounded-top-4 border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar Eliminación
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <i class="bi bi-person-x-fill text-danger fs-1 d-block mb-3"></i>
            <p class="mb-1">¿Estás seguro de eliminar al usuario</p>
            <strong>{{ usuarioSeleccionado?.nombre }}</strong>?
            <p class="text-muted small mt-2">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer border-0 justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="button" class="btn btn-danger" @click="eliminarUsuario" :disabled="guardando">
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
import { usuariosService } from '../services/api.js'
import AlertaComponent from '../components/AlertaComponent.vue'

export default {
  name: 'UsuariosView',
  components: { AlertaComponent },
  data() {
    return {
      usuarios: [],
      loading: true,
      guardando: false,
      usuarioSeleccionado: null,
      formUsuario: { nombre: '', username: '', password: '', email: '' },
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
    this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      this.loading = true
      try {
        const res = await usuariosService.getAll()
        this.usuarios = res.data
      } catch {
        this.mostrarAlerta('danger', 'Error al cargar usuarios. Verifica la API.')
      } finally {
        this.loading = false
      }
    },

    validarForm() {
      this.errores = {}
      if (!this.formUsuario.nombre.trim()) this.errores.nombre = true
      if (!this.formUsuario.username.trim()) this.errores.username = true
      if (!this.formUsuario.email.trim() || !this.formUsuario.email.includes('@')) this.errores.email = true
      if (!this.formUsuario.password?.trim()) this.errores.password = true
      return Object.keys(this.errores).length === 0
    },

    abrirModalCrear() {
      this.formUsuario = { nombre: '', username: '', password: '', email: '' }
      this.errores = {}
      this.bsModalCrear.show()
    },

    abrirModalEditar(usuario) {
      this.usuarioSeleccionado = usuario
      this.formUsuario = { ...usuario }
      this.errores = {}
      this.bsModalEditar.show()
    },

    abrirModalEliminar(usuario) {
      this.usuarioSeleccionado = usuario
      this.bsModalEliminar.show()
    },

    async crearUsuario() {
      if (!this.validarForm()) return
      this.guardando = true
      try {
        await usuariosService.create(this.formUsuario)
        this.bsModalCrear.hide()
        await this.cargarUsuarios()
        this.mostrarAlerta('success', `Usuario "${this.formUsuario.nombre}" creado correctamente.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al crear el usuario.')
      } finally {
        this.guardando = false
      }
    },

    async editarUsuario() {
      const formSinPassword = { ...this.formUsuario }
      this.errores = {}
      if (!formSinPassword.nombre.trim()) this.errores.nombre = true
      if (!formSinPassword.username.trim()) this.errores.username = true
      if (!formSinPassword.email.trim() || !formSinPassword.email.includes('@')) this.errores.email = true
      if (Object.keys(this.errores).length > 0) return

      this.guardando = true
      try {
        await usuariosService.update(this.usuarioSeleccionado.id, formSinPassword)
        this.bsModalEditar.hide()
        await this.cargarUsuarios()
        this.mostrarAlerta('warning', `Usuario "${this.formUsuario.nombre}" actualizado.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al editar el usuario.')
      } finally {
        this.guardando = false
      }
    },

    async eliminarUsuario() {
      this.guardando = true
      try {
        await usuariosService.delete(this.usuarioSeleccionado.id)
        this.bsModalEliminar.hide()
        await this.cargarUsuarios()
        this.mostrarAlerta('danger', `Usuario "${this.usuarioSeleccionado.nombre}" eliminado.`)
      } catch {
        this.mostrarAlerta('danger', 'Error al eliminar el usuario.')
      } finally {
        this.guardando = false
      }
    },

    mostrarAlerta(tipo, mensaje) {
      this.alerta = { visible: true, tipo, mensaje }
    }
  }
}
</script>
