import axios from 'axios'

// ** Establecer la URL base para las peticiones
const API_URL = 'http://localhost:8081' // Dirección de tu backend

// ** Obtener un solo usuario
export const fetchUser = (userId) => {
  return async (dispatch) => {
    try {
      // Hacemos la solicitud GET al backend para obtener un usuario por ID
      const response = await axios.get(`${API_URL}/users/${userId}`)

      // Verificamos que la respuesta tenga los datos del usuario
      if (response.data) {
        dispatch({
          type: 'FETCH_USER_SUCCESS',
          payload: response.data.data // Suponiendo que 'data' tiene los datos del usuario
        })
      } else {
        console.error('Datos no encontrados en la respuesta de FETCH_USER:', response)
      }
    } catch (err) {
      console.error('Error al obtener los datos del usuario: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
      dispatch({
        type: 'FETCH_USER_ERROR',
        payload: err.message
      })
    }
  }
}

// ** Obtener todos los datos
export const getAllData = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/users`)
      if (response.data) {
        dispatch({
          type: 'GET_ALL_DATA',
          data: response.data
        })
      } else {
        console.error('Datos no encontrados en la respuesta de GET_ALL_DATA:', response)
      }
    } catch (err) {
      console.error('Error al obtener todos los datos: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
    }
  }
}

// ** Obtener datos con parámetros de paginación
export const getData = (params) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${API_URL}/users`, { params })
      if (response.data) {
        dispatch({
          type: 'GET_DATA',
          data: response.data.data || [],  // Cambia 'users' por 'data'
          totalPages: response.data.total || 0,  // Asegúrate de que 'total' esté en la respuesta del backend
          params
        })
      } else {
        console.error('Datos no encontrados en la respuesta de GET_DATA:', response)
      }
    } catch (err) {
      console.error('Error al obtener los datos: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
    }
  }
}


// ** Obtener un solo usuario
export const getUser = (id) => {
  return async (dispatch) => {
    dispatch({ type: 'LOADING_USER', loading: true })
    console.log('Fetching user with ID:', id)

    try {
      const response = await axios.get(`${API_URL}/users/${id}`)
      if (response.data && response.data.data) {
        console.log('Datos del usuario recibidos:', response.data)
        dispatch({
          type: 'GET_USER',
          selectedUser: response.data.data
        })
      } else {
        console.error('Datos del usuario no encontrados:', response.data)
        dispatch({ type: 'GET_USER', selectedUser: null })
      }
    } catch (err) {
      console.error('Error al obtener el usuario:', err)
      dispatch({ type: 'GET_USER', selectedUser: null })
    } finally {
      dispatch({ type: 'LOADING_USER', loading: false })
    }
  }
}

// ** Añadir un nuevo usuario
export const addUser = (user) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.post(`${API_URL}/users`, user)
      if (response.data) {
        // Después de agregar el usuario, actualizamos la lista con el nuevo usuario.
        dispatch({
          type: 'ADD_USER',
          user: response.data.data || {} // Asegúrate de que `data` tenga el usuario correcto
        })
        // Actualizamos los datos con los parámetros actuales
        dispatch(getData(getState().users.params))
      } else {
        console.error('Datos no encontrados en la respuesta de ADD_USER:', response)
      }
    } catch (err) {
      console.error('Error al añadir el usuario: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
    }
  }
}


// Acción para editar un usuario
export const editUser = (id, data) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, data)
      if (response.data && response.data.status === 'success') {
        dispatch({
          type: 'EDIT_USER',
          user: response.data.data // Asegúrate de usar `data` que contiene el usuario actualizado
        })
        dispatch(getData(getState().users.params)) // Actualiza la lista con los parámetros actuales
        dispatch(getAllData()) // Recarga todos los datos
      } else {
        console.error('Datos no encontrados en la respuesta de EDIT_USER:', response)
      }
    } catch (err) {
      console.error('Error al editar el usuario: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
    }
  }
}
// En store/action.js
export const updateUser = (userData) => {
  // Aquí va la lógica para actualizar el usuario
  return {
    type: 'UPDATE_USER',
    payload: userData
  }
}

// ** Eliminar usuario
export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`)
      dispatch({
        type: 'DELETE_USER'
      })
      dispatch(getData(getState().users.params)) // Actualiza la lista con los parámetros actuales
      dispatch(getAllData()) // Recarga todos los datos
    } catch (err) {
      console.error('Error al eliminar el usuario: ', err.message)
      if (err.response) {
        console.error('Error en la respuesta:', err.response.data)
      } else if (err.request) {
        console.error('Error en la solicitud:', err.request)
      } else {
        console.error('Error al configurar la solicitud:', err.message)
      }
    }
  }
}

// ** Limpiar usuario seleccionado
export const clearSelectedUser = () => {
  return {
    type: 'CLEAR_SELECTED_USER'
  }
}
