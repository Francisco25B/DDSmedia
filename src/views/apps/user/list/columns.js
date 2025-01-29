import React from 'react'
import { Link } from 'react-router-dom'
import './customStyles.css'

// ** Custom Components
import Avatar from '@components/avatar'
import { FaUser, FaEnvelope, FaPhone, FaHome, FaLock, FaUserCog } from 'react-icons/fa'

// ** Store & Actions
import { getUser, deleteUser, updateUser } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2 } from 'react-feather'

// ** SweetAlert Import
import Swal from 'sweetalert2'
import { getData } from '../store/action/index' 

// ** Renders Client Columns
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6),
    states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary']
  const color = states[stateNum]
  const nombre = row.nombre || 'Unknown'

  if (row.avatar && row.avatar.length) {
    return <Avatar className='mr-1' img={row.avatar} width='32' height='32' />
  } else {
    return <Avatar color={color || 'primary'} className='mr-1' content={nombre} initials />
  }
}


const renderRole = row => {
  const roleObj = {
    1: { class: 'text-danger', icon: FaUser, label: 'Admin' },
    2: { class: 'text-info', icon: FaUserCog, label: 'Editor' },
    3: { class: 'text-primary', icon: FaUser, label: 'Subscriber' },
    4: { class: 'text-success', icon: FaHome, label: 'Maintainer' },
    5: { class: 'text-warning', icon: FaLock, label: 'Author' }
  }

  const role = roleObj[row.tipo_usuario_id] || {}
  const Icon = role.icon || FaUser

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon size={18} className={`${role.class || 'text-info'} mr-50`} />
      {role.label || 'Unknown'}
    </span>
  )
}

const statusObj = {
  1: 'light-success', // Active
  0: 'light-danger'   // Inactive
}

// ** Handle Edit Click Function
// ** Handle Edit Click Function
const handleEditUser = async (user) => {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
      <div class="swal-input-container">
       <div class="swal-input-group">
          <span class="swal-input-title">Tipo de Usuario</span>
          <select id="swal-input-tipo-usuario" class="swal2-input-select">
          <option value="2" ${user.tipo_usuario_id === 2 ? 'selected' : ''}>Administrador</option>
            <option value="1" ${user.tipo_usuario_id === 1 ? 'selected' : ''}>Cliente</option>
            <option value="3" ${user.tipo_usuario_id === 3 ? 'selected' : ''}>Proveedor</option>
          </select>
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title"><FaUser /> Nombre</span>
          <input id="swal-input-nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre}">
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title"><FaUser /> Apellido</span>
          <input id="swal-input-apellido" class="swal2-input" placeholder="Apellido" value="${user.apellido}">
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title"><FaEnvelope /> Email</span>
          <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${user.email}">
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title"><FaPhone /> Teléfono</span>
          <input id="swal-input-telefono" class="swal2-input" placeholder="Teléfono" value="${user.telefono}">
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title"><FaHome /> Dirección</span>
          <input id="swal-input-direccion" class="swal2-input" placeholder="Dirección" value="${user.direccion}">
        </div>
        <div class="swal-input-group">
          <span class="swal-input-title">Estado</span>
          <select id="swal-input-status" class="swal2-input-select">
            <option value="1" ${user.status === 1 ? 'selected' : ''}>Activo</option>
            <option value="0" ${user.status === 0 ? 'selected' : ''}>Inactivo</option>
          </select>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Editar Usuario',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const nombre = document.getElementById("swal-input-nombre").value.trim()
      const apellido = document.getElementById("swal-input-apellido").value.trim()
      const email = document.getElementById("swal-input-email").value.trim()
      const telefono = document.getElementById("swal-input-telefono").value.trim()
      const direccion = document.getElementById("swal-input-direccion").value.trim()
      const tipo_usuario_id = parseInt(document.getElementById("swal-input-tipo-usuario").value.trim())
      const status = parseInt(document.getElementById("swal-input-status").value.trim())
  
      if (!nombre || !apellido || !email || !telefono || !direccion || isNaN(tipo_usuario_id) || isNaN(status)) {
        Swal.showValidationMessage("Todos los campos son obligatorios y deben tener un formato válido.")
        return false
      }
  
      return { nombre, apellido, email, telefono, direccion, tipo_usuario_id, status }
    }
  })

  if (formValues) {
    const updatedUser = {
      ...user, // Mantener campos originales
      ...formValues // Sobrescribir con los campos modificados
    }

    console.log("Datos enviados al backend:", updatedUser)

    try {
      const response = await fetch(`http://localhost:8081/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser) // Enviar datos al servidor
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error de respuesta del servidor:", errorData)
        throw new Error("Error al actualizar el usuario.")
      }

      const result = await response.json()

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "El usuario se ha actualizado correctamente.",
          timer: 2000, // Cerrar automáticamente después de 2 segundos
          showConfirmButton: false // No mostrar botón de confirmación
        })
        // Actualizar el estado global de usuarios en Redux
        store.dispatch(updateUser(updatedUser))

        // Refrescar los datos después de la actualización
        store.dispatch(getData({ page: 1, perPage: 10 })) // Esto es para obtener los datos actualizados
      } else {
        Swal.fire("Error", "No se pudo actualizar el usuario.", "error")
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
      Swal.fire("Error", "Hubo un problema con la solicitud.", "error")
    }
  }
}

const handleDeleteUser = async (user) => {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar al usuario "${user.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'

  })

  if (confirm.isConfirmed) {
    try {
      const response = await fetch(`http://localhost:8081/users/${user.id}`, {
        method: 'PUT', // Usamos PUT para actualizar el estado
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 0 }) // Cambiar el estado del usuario
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        throw new Error('No se pudo eliminar el usuario.')
      }

      const result = await response.json()
      if (result.status === 'success') {
        Swal.fire('Eliminado', 'El usuario ha sido eliminado .', 'success')
        
        // Actualizamos el estado global (Redux)
        store.dispatch(getData({ page: 1, perPage: 10 }))
      } else {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error')
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      Swal.fire('Error', 'Hubo un problema con la solicitud.', 'error')
    }
  }
}

export const columns = [
  {
    name: <span> Tipo de Usuario</span>,  // Icono en el título
    minWidth: '150px',
    selector: 'tipo_usuario_id',
    sortable: true,
    cell: row => {
      const roles = { 1: 'cliente', 2: 'administrador', 3: 'proveedor' }
      return roles[row.tipo_usuario_id] || 'Unknown'
    }
  },
  { 
    name: <span><FaUser size={16} className='mr-50' /> Nombre</span>,  // Icono en el título
    minWidth: '150px', 
    selector: 'nombre', 
    sortable: true, 
    cell: row => row.nombre || 'N/A' 
  },
  { 
    name: <span><FaUser size={16} className='mr-50' /> Apellido</span>,  // Icono en el título
    minWidth: '200px', 
    selector: 'apellido', 
    sortable: true, 
    cell: row => row.apellido || 'N/A' 
  },
  { 
    name: <span><FaHome size={16} className='mr-50' /> Dirección</span>,  // Icono en el título
    minWidth: '250px', 
    selector: 'direccion', 
    sortable: true, 
    cell: row => row.direccion || 'N/A' 
  },
  { 
    name: <span><FaEnvelope size={16} className='mr-50' /> Correo Electrónico</span>,  // Icono en el título
    minWidth: '300px', 
    selector: 'email', 
    sortable: true, 
    cell: row => row.email || 'N/A' 
  },
  { 
    name: <span><FaPhone size={16} className='mr-50' /> Teléfono</span>,  // Icono en el título
    minWidth: '160px', 
    selector: 'telefono', 
    sortable: true, 
    cell: row => row.telefono || 'N/A' 
  },
  { 
    name: <span><FaUser size={16} className='mr-50' /> Usuario</span>,  // Icono en el título
    minWidth: '150px', 
    selector: 'usuario', 
    sortable: true, 
    cell: row => row.usuario || 'N/A' 
  },
  {
    name: <span><FaLock size={16} className='mr-50' /> Estado</span>,  // Icono en el título
    minWidth: '138px',
    selector: 'status',
    sortable: true,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.status] || 'light-primary'} pill>
        {row.status === 1 ? 'Activo' : 'Inactivo'}
      </Badge>
    )
  },
  {
    
    name: 'Acciones',
    
    minWidth: '100px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/user/view/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <FileText size={14} className='mr-50' />
            <span className='align-middle'>Permisos</span>
          </DropdownItem>
          <DropdownItem
            className='w-100'
            onClick={() => {
              store.dispatch(getUser(row.id))
              handleEditUser(row) 
            }}
          >
            <Edit2 size={14} className='mr-50' />
            <span className='align-middle'>Editar</span>
          </DropdownItem>
          <DropdownItem
            tag='a'
            onClick={() => handleDeleteUser(row)}
          >
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Eliminar</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]

