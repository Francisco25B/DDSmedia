const initialState = {
  allData: [], // Lista global de todos los usuarios
  data: [], // Lista de usuarios paginados
  total: 1, // Total de usuarios
  params: {}, // Parámetros de la API (como paginación)
  selectedUser: null // Inicializa con null cuando no hay usuario seleccionado
}

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATA':
      // Almacena todos los usuarios obtenidos
      return { ...state, allData: action.data }

    case 'GET_DATA':
      // Almacena los usuarios de la página actual y los parámetros relacionados
      return {
        ...state,
        data: action.data,
        total: action.total, // Asegura que la API devuelva un total válido
        params: action.params
      }

    case 'FETCH_USER': // Caso cuando se obtiene un solo usuario
      console.log('Nuevo selectedUser:', action.payload) // Log para depuración
      // Verifica que el usuario seleccionado tenga datos válidos
      if (action.payload && action.payload.id) {
        return { ...state, selectedUser: action.payload }
      } else {
        console.error('Datos del usuario faltantes o inválidos:', action.payload)
        return { ...state, selectedUser: null } // Resetea si los datos no son válidos
      }

      case 'ADD_USER':
        console.log('Acción de agregar usuario recibida:', action.user)
        const newUser = action.user
        console.log('Nuevo usuario añadido:', newUser) // Log para depuración
        return {
          ...state,
          allData: [...state.allData, newUser], // Añade el nuevo usuario a la lista global
          // Si el usuario pertenece a la página actual, también lo añadimos a la lista paginada
          data: state.params.page === action.page ? [...state.data, newUser] : state.data
        }
      

    case 'DELETE_USER':
      if (!Array.isArray(state.allData)) {
        console.error('allData no es un arreglo:', state.allData)
        return state // Si no es un arreglo, no hacemos nada
      }

      // Filtra la lista global y los usuarios paginados para eliminar el usuario
      const updatedAllData = state.allData.filter((user) => user.id !== action.id)
      const updatedData = state.data.filter((user) => user.id !== action.id)

      // Si hay menos usuarios en la página actual y estamos en la última página, podemos disminuir la página
      let updatedPage = state.params.page
      if (updatedData.length === 0 && updatedPage > 1) {
        updatedPage -= 1 // Disminuir la página si es necesario
      }

      return {
        ...state,
        allData: updatedAllData,
        data: updatedData,
        params: { ...state.params, page: updatedPage } // Actualiza los parámetros de paginación
      }

    case 'CLEAR_SELECTED_USER':
      // Limpia el usuario seleccionado
      return { ...state, selectedUser: null }

    case 'STORE_DATA':
      // Almacena datos relacionados al estado de los usuarios (por ejemplo, total de usuarios)
      return {
        ...state,
        allData: action.data.allData,
        data: action.data.data,
        total: action.data.total,
        params: action.data.params
      }

    default:
      return state // Retorna el estado actual si no coincide con ningún caso
  }
}

export default users
