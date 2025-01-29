
// ** Limpiar el usuario seleccionado
export const clearSelectedUser = () => {
  return {
    type: 'CLEAR_SELECTED_USER'
  }
}

// Acción para eliminar un usuario
export const deleteUser = id => {
  return {
    type: 'DELETE_USER',
    payload: id
  }
}
