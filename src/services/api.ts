// API Service para comunicación con el backend
// La URL base se obtiene de las variables de entorno
// En desarrollo: http://localhost:4000/api
// En producción: configurar VITE_API_BASE_URL en el archivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Interfaces para las respuestas del backend
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Interfaces para Reservas (compatible con el backend)
export interface Reserva {
  _id: string;
  numeroReserva: string;
  usuario: string;
  paquete: {
    _id: string;
    nombre: string;
    destino: string;
    precio: number;
  };
  fechaReserva: string;
  fechaViaje: string;
  cantidadPersonas: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateReservaRequest {
  paquete: string;
  fechaViaje: string;
  cantidadPersonas: number;
  precioTotal: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  usuario?: string; // ID del usuario
  datosContacto: {
    nombre: string;
    email: string;
    telefono: string;
  };
}

export interface UpdateReservaRequest {
  fechaViaje?: string;
  cantidadPersonas?: number;
  precioTotal?: number;
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia';
  observaciones?: string;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  datosContacto?: {
    nombre?: string;
    email?: string;
    telefono?: string;
  };
}

// Interfaces para Paquetes
export interface Paquete {
  _id: string;
  nombre: string;
  destino: string;
  fecha: string;
  precio: number;
  descripcion?: string;
  activo: boolean;
  moneda?: string; // "USD", "ARS", "BRL", "MXN", etc.
  // Nuevos campos para información detallada
  imagenes?: string[]; // Múltiples imágenes por paquete
  duracion?: string; // "7 días / 6 noches"
  fechaSalida?: string; // Fecha de salida específica
  fechaRegreso?: string; // Fecha de regreso específica
  incluye?: string[]; // ["Vuelos", "Hotel", "Desayuno", "Traslados"]
  noIncluye?: string[]; // ["Almuerzos", "Propinas", "Seguro"]
  requisitos?: string[]; // ["Pasaporte vigente", "Vacuna fiebre amarilla"]
  categoria?: string; // "Aventura", "Playa", "Cultural", etc.
  destacado?: boolean; // Para mostrar en home
  cuposDisponibles?: number; // Disponibilidad real
  precioAnterior?: number; // Para mostrar descuentos
}

// Interfaces para Usuario
export interface User {
  _id: string;
  usuario: string;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

// Interfaces para Suscriptores
export interface Suscriptor {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
  fechaSuscripcion: string;
  activo: boolean;
  fechaDesuscripcion?: string;
}

export interface CreateSuscriptorRequest {
  nombre: string;
  apellido: string;
  email: string;
  pais: string;
  ciudad: string;
}

export interface UpdateSuscriptorRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  pais?: string;
  ciudad?: string;
  activo?: boolean;
}

// Interfaces para Pagos
export interface Pago {
  _id: string;
  reserva: string | Reserva;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  monto: number;
  moneda: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'cancelado';
  fechaPago?: string;
  fechaVencimiento?: string;
  referencia?: string;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreatePagoRequest {
  reserva: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  monto: number;
  moneda?: string;
  fechaVencimiento?: string;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
}

export interface UpdatePagoRequest {
  estado?: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'cancelado';
  fechaPago?: string;
  referencia?: string;
  datosPago?: {
    numeroTarjeta?: string;
    tipoTarjeta?: string;
    numeroComprobante?: string;
    banco?: string;
    cuenta?: string;
    lugarPago?: string;
    recibidoPor?: string;
  };
  observaciones?: string;
}

export interface LoginResponse {
  token: string;
}

// Clase para manejar las peticiones HTTP
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  // Método para establecer el token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Método genérico para hacer peticiones HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Agregar token de autenticación si existe
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        // Incluir mensaje del backend si está disponible
        const errorMessage = errorData.message 
          ? `${errorData.error || 'Error'}: ${errorData.message}`
          : errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Métodos para autenticación
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Guardar el token
    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    this.setToken(null);
  }

  // Métodos para reservas
  async getReservas(params?: {
    estado?: string;
    usuario?: string;
    paquete?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<Reserva>> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.usuario) queryParams.append('usuario', params.usuario);
    if (params?.paquete) queryParams.append('paquete', params.paquete);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/reserva${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Reserva>>(endpoint);
  }

  async getMisReservas(params?: {
    estado?: string;
    usuarioId?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<Reserva>> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.usuarioId) queryParams.append('usuarioId', params.usuarioId);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/reserva/mis-reservas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Reserva>>(endpoint);
  }

  async getReservaById(id: string): Promise<Reserva> {
    return this.request<Reserva>(`/reserva/${id}`);
  }

  async createReserva(data: CreateReservaRequest): Promise<{ message: string; reserva: Reserva }> {
    return this.request<{ message: string; reserva: Reserva }>('/reserva', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReserva(id: string, data: UpdateReservaRequest): Promise<{ message: string; reserva: Reserva }> {
    return this.request<{ message: string; reserva: Reserva }>(`/reserva/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelarReserva(id: string): Promise<{ message: string; reserva: Reserva }> {
    return this.request<{ message: string; reserva: Reserva }>(`/reserva/${id}/cancelar`, {
      method: 'PUT',
    });
  }

  async confirmarReserva(id: string): Promise<{ message: string; reserva: Reserva }> {
    return this.request<{ message: string; reserva: Reserva }>(`/reserva/${id}/confirmar`, {
      method: 'PUT',
    });
  }

  async deleteReserva(id: string): Promise<{ message: string; reserva: Reserva }> {
    return this.request<{ message: string; reserva: Reserva }>(`/reserva/${id}`, {
      method: 'DELETE',
    });
  }

  async getReservasStats(params?: {
    fechaInicio?: string;
    fechaFin?: string;
  }): Promise<{
    estadisticas: Array<{ _id: string; count: number; totalIngresos: number }>;
    totalReservas: number;
    totalIngresos: number;
  }> {
    const queryParams = new URLSearchParams();
    if (params?.fechaInicio) queryParams.append('fechaInicio', params.fechaInicio);
    if (params?.fechaFin) queryParams.append('fechaFin', params.fechaFin);

    const endpoint = `/reserva/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  // Métodos para paquetes
  async getPaquetes(): Promise<Paquete[]> {
    return this.request<Paquete[]>('/paquete');
  }

  async getPaqueteById(id: string): Promise<Paquete> {
    return this.request<Paquete>(`/paquete/${id}`);
  }

  // Métodos para gestión de usuarios
  async registerUser(data: { usuario: string; password: string }): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/user');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/user/${id}`);
  }

  async updateCurrentUser(data: Partial<{ usuario: string }>): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/user/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCurrentUser(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/user/me', {
      method: 'DELETE',
    });
  }

  // Métodos para suscriptores
  async getSuscriptores(params?: { activo?: boolean; limit?: number; page?: number }): Promise<{ data: Suscriptor[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.activo !== undefined) queryParams.append('activo', params.activo.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const endpoint = `/suscriptor${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ data: Suscriptor[]; pagination: any }>(endpoint);
  }

  async getSuscriptorById(id: string): Promise<Suscriptor> {
    return this.request<Suscriptor>(`/suscriptor/${id}`);
  }

  async createSuscriptor(data: CreateSuscriptorRequest): Promise<{ message: string; suscriptor: Suscriptor }> {
    return this.request<{ message: string; suscriptor: Suscriptor }>('/suscriptor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSuscriptor(id: string, data: UpdateSuscriptorRequest): Promise<{ message: string; suscriptor: Suscriptor }> {
    return this.request<{ message: string; suscriptor: Suscriptor }>(`/suscriptor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async desuscribirSuscriptor(id: string): Promise<{ message: string; suscriptor: Suscriptor }> {
    return this.request<{ message: string; suscriptor: Suscriptor }>(`/suscriptor/${id}/desuscribir`, {
      method: 'PUT',
    });
  }

  async deleteSuscriptor(id: string): Promise<{ message: string; suscriptor: Suscriptor }> {
    return this.request<{ message: string; suscriptor: Suscriptor }>(`/suscriptor/${id}`, {
      method: 'DELETE',
    });
  }

  async getSuscriptoresStats(): Promise<{ totalSuscriptores: number; suscriptoresActivos: number; suscriptoresInactivos: number; porPais: any[] }> {
    return this.request('/suscriptor/stats');
  }

  // Métodos para pagos
  async getPagos(params?: {
    estado?: string;
    metodoPago?: string;
    reserva?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<Pago>> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
    if (params?.metodoPago) queryParams.append('metodoPago', params.metodoPago);
    if (params?.reserva) queryParams.append('reserva', params.reserva);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const endpoint = `/pago${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Pago>>(endpoint);
  }

  async getPagoById(id: string): Promise<Pago> {
    return this.request<Pago>(`/pago/${id}`);
  }

  async getPagoByReserva(reservaId: string): Promise<Pago> {
    return this.request<Pago>(`/pago/reserva/${reservaId}`);
  }

  async createPago(data: CreatePagoRequest): Promise<{ message: string; pago: Pago }> {
    return this.request<{ message: string; pago: Pago }>('/pago', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePago(id: string, data: UpdatePagoRequest): Promise<{ message: string; pago: Pago }> {
    return this.request<{ message: string; pago: Pago }>(`/pago/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async completarPago(id: string, data: { referencia?: string; datosPago?: any }): Promise<{ message: string; pago: Pago }> {
    return this.request<{ message: string; pago: Pago }>(`/pago/${id}/completar`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePago(id: string): Promise<{ message: string; pago: Pago }> {
    return this.request<{ message: string; pago: Pago }>(`/pago/${id}`, {
      method: 'DELETE',
    });
  }
}

// Instancia singleton del servicio API
export const apiService = new ApiService(API_BASE_URL);

// Función helper para manejar errores de API
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
};

export default apiService;
