// Forma de los datos que devuelve el backend después del login
export interface AuthResponse {
  token: string;
  email: string;
  mensaje: string;
}

// Datos que el usuario escribe para hacer login
export interface LoginRequest {
  email: string;
  contrasenia: string;
}

// Datos que el usuario escribe para registrarse
export interface RegisterRequest {
  email: string;
  contrasenia: string;
}
