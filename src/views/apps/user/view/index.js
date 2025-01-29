// ** Reactstrap
import { Card, CardHeader, CardTitle, CardText, Table, CustomInput } from 'reactstrap'

const PermissionsTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Permisos</CardTitle>
      </CardHeader>
      <CardText className='ml-2'>Permisos acuerdo al tipo de usuario</CardText>
      <Table striped borderless responsive>
  <thead className='thead-light'>
    <tr>
      <th>Modulo</th>
      <th>Ver</th>
      <th>Editar</th>
      <th>Agregar</th>
      <th>Eliminar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ingresos</td>
      <td>
        <CustomInput type='checkbox' id='admin-1' label='' defaultChecked />
      </td>
      <td>
        <CustomInput type='checkbox' id='admin-2' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='admin-3' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='admin-4' label='' />
      </td>
    </tr>
    <tr>
      <td>Egresos</td>
      <td>
        <CustomInput type='checkbox' id='staff-1' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='staff-2' label='' defaultChecked />
      </td>
      <td>
        <CustomInput type='checkbox' id='staff-3' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='staff-4' label='' />
      </td>
    </tr>
    <tr>
      <td>Estado Resultado</td>
      <td>
        <CustomInput type='checkbox' id='author-1' label='' defaultChecked />
      </td>
      <td>
        <CustomInput type='checkbox' id='author-2' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='author-3' label='' defaultChecked />
      </td>
      <td>
        <CustomInput type='checkbox' id='author-4' label='' />
      </td>
    </tr>
    <tr>
      <td>Reportes Generales</td>
      <td>
        <CustomInput type='checkbox' id='contributor-1' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='contributor-2' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='contributor-3' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='contributor-4' label='' />
      </td>
    </tr>
    <tr>
      <td>Usuarios</td>
      <td>
        <CustomInput type='checkbox' id='user-1' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='user-2' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='user-3' label='' />
      </td>
      <td>
        <CustomInput type='checkbox' id='user-4' label='' defaultChecked />
      </td>
    </tr>
  </tbody>
</Table>

    </Card>
  )
  
}

export default PermissionsTable
