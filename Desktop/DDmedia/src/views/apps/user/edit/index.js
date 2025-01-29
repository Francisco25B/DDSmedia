import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap'
import { store } from '@store/storeConfig/store'
import { getUser, updateUser } from '../store/action'

const EditUserModal = ({ isOpen, toggle, userId }) => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (userId) {
      store.dispatch(getUser(userId)).then(response => {
        setUserData(response.data) // Asegúrate de que la respuesta tenga los datos correctamente
      })
    }
  }, [userId])

  const handleSave = () => {
    if (userData) {
      store.dispatch(updateUser(userData))
      toggle() // Cierra el modal después de guardar
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Editar Usuario</ModalHeader>
      <ModalBody>
        {userData ? (
          <>
            <Input
              type='text'
              value={userData.nombre}
              onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
            />
            <Input
              type='text'
              value={userData.apellido}
              onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
            />
            <Input
              type='email'
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <Input
              type='text'
              value={userData.telefono}
              onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
            />
          </>
        ) : (
          <p>Cargando datos...</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
        <Button color="primary" onClick={handleSave}>Guardar Cambios</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditUserModal
