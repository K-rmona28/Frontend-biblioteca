/** * API MODELS - FULL COMPATIBILITY VERSION 
 * Soluciona errores de null vs undefined y campos faltantes
 */

// --- USUARIO ---
export interface UsuarioRead {
  id_usuario: string;
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
  telefono?: string | null; // Añadido para corregir error en login.ts
  activo?: boolean;
}
export interface UsuarioUpdate extends Partial<UsuarioCreate> { 
  id_usuario_edita?: string; 
}

// --- CATEGORIA ---
export interface CategoriaRead {
  id_categoria: string;
  nombre: string;
  descripcion?: string | null; 
}
export interface CategoriaCreate {
  nombre: string;
  descripcion?: string | null; // Cambiado a string | null para aceptar nulos del formulario
}
export interface CategoriaUpdate extends Partial<CategoriaCreate> {}

// --- LIBRO ---
export interface LibroRead {
  id_libro: string;
  titulo: string;
  isbn: string;
  anio_publicacion: number;
  id_editorial: string;
  id_categoria: string;
  nombre_editorial?: string;
  nombre_categoria?: string;
}
export interface LibroCreate {
  titulo: string;
  isbn: string;
  anio_publicacion: number | null; // Cambiado para aceptar nulos del formulario
  id_editorial: string;
  id_categoria: string;
}
export interface LibroUpdate extends Partial<LibroCreate> {}

// --- EDITORIAL ---
export interface EditorialRead {
  id_editorial: string;
  nombre: string;
  pais: string | null;
}
export interface EditorialCreate {
  nombre: string;
  pais?: string | null;
}
export interface EditorialUpdate extends Partial<EditorialCreate> {}

// --- AUTOR ---
export interface AutorRead {
  id_autor: string;
  nombre: string;
  nacionalidad: string | null;
}
export interface AutorCreate {
  nombre: string;
  nacionalidad?: string | null;
}
export interface AutorUpdate extends Partial<AutorCreate> {}

// --- PRESTAMO ---
export interface PrestamoRead {
  id_prestamo: string;
  id_usuario: string;
  fecha_prestamo: string;
  fecha_devolucion_propuesta: string;
  fecha_devolucion_real: string | null;
  estado: string;
}
export interface PrestamoCreate {
  id_usuario: string;
  fecha_devolucion_propuesta: string;
}
export interface PrestamoUpdate extends Partial<PrestamoCreate> {
  fecha_devolucion_real?: string | null;
  estado?: string;
  id_usuario_edita?: string;
}

// --- OTROS ---
export interface MultaRead { id_multa: string; id_prestamo: string; valor_multa: number; fecha_creacion: string; estado_pago: boolean; }
export interface MultaCreate { id_prestamo: string; valor_multa: number; }
export interface MultaUpdate extends Partial<MultaCreate> { estado_pago?: boolean; }
export interface EmpleadoRead { id_empleado: string; nombre_completo: string; cargo: string; email: string; activo: boolean; }
export interface EjemplarRead { id_ejemplar: string; id_libro: string; estado_conservacion: string; disponible: boolean; }
export interface DetallePrestamoRead { id_detalle_prestamo: string; id_prestamo: string; id_ejemplar: string; }