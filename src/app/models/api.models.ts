/** Contratos del Frontend alineados con las entidades de la Base de Datos del Backend. */

// ==========================================
// 1. ENTIDAD: USUARIO
// ==========================================
export interface UsuarioRead {
  id_usuario: string; // UUID -> string
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  rol: string;
  telefono: string | null;
  activo: boolean;
}

export interface UsuarioCreate {
  nombre_completo: string;
  nombre_usuario: string;
  email: string;
  clave: string;
  rol: string;
  telefono?: string | null;
  activo?: boolean;
}

export interface UsuarioUpdate {
  nombre_completo?: string;
  nombre_usuario?: string;
  email?: string;
  clave?: string;
  rol?: string;
  telefono?: string | null;
  activo?: boolean;
}

// ==========================================
// 2. ENTIDAD: EMPLEADO
// ==========================================
export interface EmpleadoRead {
  id_empleado: string; // UUID -> string
  nombre_completo: string;
  cargo: string;
  email: string;
  activo: boolean;
}

export interface EmpleadoCreate {
  nombre_completo: string;
  cargo: string;
  email: string;
  clave: string;
  activo?: boolean;
}

export interface EmpleadoUpdate {
  nombre_completo?: string;
  cargo?: string;
  email?: string;
  clave?: string;
  activo?: boolean;
}

// ==========================================
// 3. ENTIDAD: AUTOR
// ==========================================
export interface AutorRead {
  id_autor: string; // UUID -> string
  nombre: string;
  nacionalidad: string | null;
  fecha_nacimiento: string | null;
}

export interface AutorCreate {
  nombre: string;
  nacionalidad?: string | null;
  fecha_nacimiento?: string | null;
}

export interface AutorUpdate {
  nombre?: string;
  nacionalidad?: string | null;
  fecha_nacimiento?: string | null;
}

// ==========================================
// 4. ENTIDAD: EDITORIAL
// ==========================================
export interface EditorialRead {
  id_editorial: string; // UUID -> string
  nombre: string;
  pais: string | null;
}

export interface EditorialCreate {
  nombre: string;
  pais?: string | null;
}

export interface EditorialUpdate {
  nombre?: string;
  pais?: string | null;
}

// ==========================================
// 5. ENTIDAD: CATEGORIA
// ==========================================
export interface CategoriaRead {
  id_categoria: string; // UUID -> string
  nombre: string;
  descripcion: string | null;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null;
}

export interface CategoriaUpdate {
  nombre?: string;
  descripcion?: string | null;
}

// ==========================================
// 6. ENTIDAD: LIBRO
// ==========================================
export interface LibroRead {
  id_libro: string; // UUID -> string
  id_editorial: string; // UUID -> string
  id_categoria: string; // UUID -> string
  titulo: string;
  isbn: string;
  anio_publicacion: number | null;
}

export interface LibroCreate {
  id_editorial: string;
  id_categoria: string;
  titulo: string;
  isbn: string;
  anio_publicacion?: number | null;
}

export interface LibroUpdate {
  id_editorial?: string;
  id_categoria?: string;
  titulo?: string;
  isbn?: string;
  anio_publicacion?: number | null;
}

// ==========================================
// 7. ENTIDAD INTERMEDIA: LIBRO_AUTOR
// ==========================================
export interface LibroAutorRead {
  id_libro: string; // UUID -> string
  id_autor: string; // UUID -> string
}

export interface LibroAutorCreate {
  id_libro: string;
  id_autor: string;
}

// ==========================================
// 8. ENTIDAD: EJEMPLAR
// ==========================================
export interface EjemplarRead {
  id_ejemplar: string; // UUID -> string
  id_libro: string; // UUID -> string
  estado_conservacion: string; // 'Excelente', 'Bueno', 'Dañado'
  disponible: boolean;
}

export interface EjemplarCreate {
  id_libro: string;
  estado_conservacion: string;
  disponible?: boolean;
}

export interface EjemplarUpdate {
  id_libro?: string;
  estado_conservacion?: string;
  disponible?: boolean;
}

// ==========================================
// 9. ENTIDAD: RESERVA
// ==========================================
export interface ReservaRead {
  id_reserva: string; // UUID -> string
  id_usuario: string; // UUID -> string
  id_libro: string; // UUID -> string
  fecha_reserva: string;
  estado_reserva: string; // 'Pendiente', 'Completada', 'Cancelada'
}

export interface ReservaCreate {
  id_usuario: string;
  id_libro: string;
  fecha_reserva: string;
  estado_reserva?: string;
}

export interface ReservaUpdate {
  id_usuario?: string;
  id_libro?: string;
  fecha_reserva?: string;
  estado_reserva?: string;
}

// ==========================================
// 10. ENTIDAD: PRESTAMO
// ==========================================
export interface PrestamoRead {
  id_prestamo: string; // UUID -> string
  id_usuario: string; // UUID -> string
  fecha_prestamo: string;
  fecha_devolucion_propuesta: string;
  fecha_devolucion_real: string | null;
  estado: string; // 'Activo', 'Devuelto', 'Vencido'
  id_usuario_creacion: string; // UUID -> string
  id_usuario_edita: string | null; // UUID -> string
}

export interface PrestamoCreate {
  id_usuario: string;
  fecha_devolucion_propuesta: string;
  id_usuario_creacion: string;
}

export interface PrestamoUpdate {
  id_usuario?: string;
  fecha_devolucion_propuesta?: string;
  fecha_devolucion_real?: string | null;
  estado?: string;
  id_usuario_edita: string;
}

// ==========================================
// 11. ENTIDAD: DETALLE PRESTAMO
// ==========================================
export interface DetallePrestamoRead {
  id_detalle_prestamo: string; // UUID -> string
  id_prestamo: string; // UUID -> string
  id_ejemplar: string; // UUID -> string
  estado_entregado: string;
  estado_devuelto: string | null;
}

export interface DetallePrestamoCreate {
  id_prestamo: string;
  id_ejemplar: string;
  estado_entregado: string;
}

export interface DetallePrestamoUpdate {
  id_prestamo?: string;
  id_ejemplar?: string;
  estado_entregado?: string;
  estado_devuelto?: string | null;
}

// ==========================================
// 12. ENTIDAD: MULTA
// ==========================================
export interface MultaRead {
  id_multa: string; // UUID -> string
  id_prestamo: string; // UUID -> string
  valor_multa: number;
  fecha_creacion: string;
  estado_pago: boolean;
  id_usuario_creacion: string; // UUID -> string
  id_usuario_edita: string | null; // UUID -> string
}

export interface MultaCreate {
  id_prestamo: string;
  valor_multa: number;
  id_usuario_creacion: string;
}

export interface MultaUpdate {
  id_prestamo?: string;
  valor_multa?: number;
  estado_pago?: boolean;
  id_usuario_edita: string;
}