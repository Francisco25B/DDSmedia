import useJwt from '@src/@core/auth/jwt/useJwt'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => {
  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName);
  
  return userData && token; // Verifica si ambos existen
}

export const getUserData = () => {
  // Asegúrate de que localStorage tenga un formato válido antes de intentar parsearlo
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null; // Retorna null si no existe 'userData'
}

/**
 * This function returns the appropriate route based on the user's role or type.
 * @param {String} userRole Role or type of the user.
 */
export const getHomeRouteForLoggedInUser = () => {
  const userData = getUserData();

  if (userData) {
    const { tipo_usuario_id } = userData.data;

    // Cambia las condiciones basadas en los IDs de usuario que tengas configurados
    if (tipo_usuario_id === 1) {  // Admin
      return '/'; // Ruta de admin, puedes ajustarla según tu necesidad
    }
    if (tipo_usuario_id === 2) {  // Cliente
      return '/'; // Ruta de cliente (ajústalo según tu configuración de rutas)
    }
  }

  // Ruta por defecto si no se encuentra un tipo de usuario
  return '/'; // Redirige a login si no hay usuario o tipo válido
}
