// API Service para comunicación con el backend
const API_BASE_URL = 'http://localhost:4000/api';

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
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
    limit?: number;
    page?: number;
  }): Promise<PaginatedResponse<Reserva>> {
    const queryParams = new URLSearchParams();
    if (params?.estado) queryParams.append('estado', params.estado);
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
