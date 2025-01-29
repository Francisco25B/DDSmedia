import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, FormGroup, Label, FormText, Form, Input } from 'reactstrap'
import Sidebar from '@components/sidebar'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { getData } from '../store/action/index'
import 'react-toastify/dist/ReactToastify.css'
import './formStyles.css' // Estilos personalizados opcionales
import { FaUser, FaEnvelope, FaPhone, FaHome, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

toast.configure()

const SidebarNewUsers = ({ open, toggleSidebar, fetchUsers, currentPage, rowsPerPage }) => {
  const dispatch = useDispatch()
  const [tipoUsuario, setTipoUsuario] = useState(2) // Tipo de usuario predeterminado: Administrador
  const { register, handleSubmit, errors, setValue, watch } = useForm()

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [usuarioGenerado, setUsuarioGenerado] = useState('') // Estado para el campo de usuario
  const [idGenerado, setIdGenerado] = useState('') // Estado para el ID de usuario

  const allData = useSelector((state) => state.users.allData)

  const fetchNextUserId = async () => {
    try {
      const { data: users } = await axios.get('http://localhost:8081/users')
      const nextId = users.data.length ? users.data[users.data.length - 1].id + 1 : 1
      setIdGenerado(nextId)
    } catch (error) {
      console.error('Error al obtener el siguiente ID de usuario:', error)
    }
  }

  const onSubmit = async (values) => {
    // Validación adicional para correo y teléfono
    const email = values.email || ''
    const telefono = values.telefono || ''

    if (!email && !telefono) {
      toast.error('Debes ingresar al menos un correo electrónico o un teléfono.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      })
      return
    }

    try {
      const { data: users } = await axios.get('http://localhost:8081/users')
      const nextId = users.data.length ? users.data[users.data.length - 1].id + 1 : 1

      const primerNombre = values.nombre.split(' ')[0]
      let prefijo = ''

      if (tipoUsuario === 1) prefijo = 'cli'
      if (tipoUsuario === 2) prefijo = 'admin'
      if (tipoUsuario === 3) prefijo = 'prov'

      const usuarioGenerado = `${prefijo}${nextId}${primerNombre}`

      const formattedUserData = {
        ...values,
        tipo_usuario_id: tipoUsuario,
        status: 1,
        empresa_id: 1,
        usuario: usuarioGenerado
      }

      const response = await axios.post('http://localhost:8081/users', formattedUserData)

      if (response.status === 201) {
        toast.success('Usuario creado correctamente.', {
          className: 'custom-toast'
        })
        console.log('Respuesta del backend para el usuario agregado:', response.data)

        dispatch(getData({ page: currentPage, perPage: rowsPerPage }))
        toggleSidebar()

        fetchNextUserId() // Actualizar el siguiente ID
      } else {
        throw new Error('Error al crear el usuario.')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Hubo un problema al conectar con el servidor.')
    }
  }

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)

  const calculateUsuario = () => {
    const nombre = watch('nombre') || ''
    const primerNombre = nombre.split(' ')[0]
    const prefijo = tipoUsuario === 1 ? 'cli' : tipoUsuario === 2 ? 'admin' : 'prov'
    setUsuarioGenerado(`${prefijo}${idGenerado}${primerNombre}`)
  }

  useEffect(() => {
    fetchNextUserId() // Recargar el siguiente ID cuando se monta el componente
  }, [])

  useEffect(() => {
    calculateUsuario() // Recalcular el usuario generado cuando cambian los datos

    const email = watch('email')
    const telefono = watch('telefono')

    if (email) {
      setValue('telefono', '')
    }

    if (telefono) {
      setValue('email', '')
    }
  }, [watch('email'), watch('telefono'), watch('nombre')])

  return (
    <Sidebar
      size="lg"
      open={open}
      title="Nuevo Usuario"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Tipo de Usuario */}
        <FormGroup>
          <Label for="tipo_usuario_id">Tipo de Usuario</Label>
          <Input
            type="select"
            id="tipo_usuario_id"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(Number(e.target.value))}
          >
            <option value={2}>Administrador</option>
            <option value={1}>Cliente</option>
            <option value={3}>Proveedor</option>
          </Input>
        </FormGroup>

        {/* Nombre */}
        <FormGroup>
          <Label for="nombre" className="d-flex align-items-center">
            <FaUser className="mr-2" /> Nombre <span className="text-danger">*</span>
          </Label>
          <Input
            name="nombre"
            id="nombre"
            placeholder="John"
            innerRef={register({ required: true })}
            className={errors.nombre ? 'is-invalid' : ''}
          />
          {errors.nombre && <FormText color="danger">Este campo es obligatorio.</FormText>}
        </FormGroup>

        {/* Apellido */}
        <FormGroup>
          <Label for="apellido" className="d-flex align-items-center">
            <FaUser className="mr-2" /> Apellido
          </Label>
          <Input name="apellido" id="apellido" placeholder="Doe" innerRef={register()} />
        </FormGroup>

        {/* Email */}
        <FormGroup>
          <Label for="email" className="d-flex align-items-center">
            <FaEnvelope className="mr-2" /> Email
          </Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="john.doe@example.com"
            innerRef={register()}
            className={errors.email ? 'is-invalid' : ''}
          />
          {errors.email && <FormText color="danger">Este campo es obligatorio.</FormText>}
        </FormGroup>

        {/* Teléfono */}
        <FormGroup>
          <Label for="telefono" className="d-flex align-items-center">
            <FaPhone className="mr-2" /> Teléfono
          </Label>
          <Input
            name="telefono"
            id="telefono"
            placeholder="1234567890"
            innerRef={register({
              pattern: /^[0-9]{10}$/
            })}
            className={errors.telefono ? 'is-invalid' : ''}
          />
          {errors.telefono && <FormText color="danger">El teléfono debe ser de 10 dígitos.</FormText>}
        </FormGroup>

        {/* Dirección */}
        <FormGroup>
          <Label for="direccion" className="d-flex align-items-center">
            <FaHome className="mr-2" /> Dirección
          </Label>
          <Input
            name="direccion"
            id="direccion"
            placeholder="Calle Principal 123"
            innerRef={register()}
          />
        </FormGroup>

        {/* Usuario (Campo generado dinámicamente) */}
        <FormGroup>
          <Label for="usuario" className="d-flex align-items-center">
            <FaUser className="mr-2" /> Usuario
          </Label>
          <Input
            name="usuario"
            id="usuario"
            value={usuarioGenerado}
            disabled
          />
        </FormGroup>

        {/* Contraseña */}
        <FormGroup>
          <Label for="password" className="d-flex align-items-center">
            <FaLock className="mr-2" /> Contraseña <span className="text-danger">*</span>
          </Label>
          <div className="input-group">
            <Input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="********"
              innerRef={register({
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
              })}
              className={errors.password ? 'is-invalid' : ''}
            />
            <div className="input-group-append">
              <Button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </Button>
            </div>
          </div>
          {errors.password && (
            <FormText color="danger">
              La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.
            </FormText>
          )}
        </FormGroup>

        {/* Botones de acción */}
        <Button type="submit" className="mr-1" color="primary">
          Guardar
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancelar
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
