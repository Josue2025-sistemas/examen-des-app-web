<template>
  <!-- Alerta Bootstrap reutilizable con auto-cierre -->
  <div
    v-if="visible"
    :class="`alert alert-${tipo} alert-dismissible fade show shadow-sm`"
    role="alert"
  >
    <i :class="icono + ' me-2'"></i>
    {{ mensaje }}
    <button type="button" class="btn-close" @click="cerrar"></button>
  </div>
</template>

<script>
export default {
  name: 'AlertaComponent',
  props: {
    /** Tipo Bootstrap: success | danger | warning | info */
    tipo: { type: String, default: 'success' },
    /** Texto del mensaje */
    mensaje: { type: String, required: true },
    /** Tiempo en ms antes de auto-cerrar (0 = no cierra solo) */
    duracion: { type: Number, default: 3000 }
  },
  emits: ['cerrar'],
  data() {
    return { visible: true }
  },
  computed: {
    // Ícono según el tipo de alerta
    icono() {
      const iconos = {
        success: 'bi bi-check-circle-fill',
        danger: 'bi bi-x-circle-fill',
        warning: 'bi bi-exclamation-triangle-fill',
        info: 'bi bi-info-circle-fill'
      }
      return iconos[this.tipo] || 'bi bi-bell-fill'
    }
  },
  mounted() {
    // Auto-cierra la alerta después del tiempo definido
    if (this.duracion > 0) {
      setTimeout(() => this.cerrar(), this.duracion)
    }
  },
  methods: {
    cerrar() {
      this.visible = false
      this.$emit('cerrar')
    }
  }
}
</script>
