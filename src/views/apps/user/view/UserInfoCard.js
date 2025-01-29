// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import { Card, CardBody, CardText, Button, Row, Col } from 'reactstrap'
import { DollarSign, TrendingUp, User, Check, Star, Flag, Phone } from 'react-feather'

const UserInfoCard = ({ selectedUser }) => {
  if (!selectedUser) {
    return <div>Cargando...</div> // O algún componente de carga si `selectedUser` es null
  }

  return (
    <Card>
      <CardBody>
        <Row>
          <Col xl='6' lg='12' className='d-flex flex-column justify-content-between border-container-lg'>
            <div className='user-avatar-section'>
              <div className='d-flex justify-content-start'>
                <div className='d-flex flex-column ml-1'>
                  <div className='user-info mb-1'>
                    <h4 className='mb-0'>
                      {selectedUser ? `${selectedUser.nombre} ${selectedUser.apellido}` : 'Nombre no disponible'}
                    </h4>
                    <CardText tag='span'>
                      {selectedUser ? selectedUser.email : 'Email no disponible'}
                    </CardText>
                  </div>
                  <div className='d-flex flex-wrap align-items-center'>
                    <Button.Ripple tag={Link} to={`/apps/user/edit/${selectedUser.id}`} color='primary'>
                      Editar
                    </Button.Ripple>
                    <Button.Ripple className='ml-1' color='danger' outline>
                      Eliminar
                    </Button.Ripple>
                  </div>
                </div>
              </div>
            </div>
            <div className='d-flex align-items-center user-total-numbers'>
              <div className='d-flex align-items-center mr-2'>
                <div className='color-box bg-light-primary'>
                  <DollarSign className='text-primary' />
                </div>
                <div className='ml-1'>
                  <h5 className='mb-0'>23.3k</h5>
                  <small>Ventas Mensuales</small>
                </div>
              </div>
              <div className='d-flex align-items-center'>
                <div className='color-box bg-light-success'>
                  <TrendingUp className='text-success' />
                </div>
                <div className='ml-1'>
                  <h5 className='mb-0'>$99.87K</h5>
                  <small>Beneficio Anual</small>
                </div>
              </div>
            </div>
          </Col>
          <Col xl='6' lg='12' className='mt-2 mt-xl-0'>
            <div className='user-info-wrapper'>
              <div className='d-flex flex-wrap align-items-center'>
                <div className='user-info-title'>
                  <User className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Usuario
                  </CardText>
                </div>
                <CardText className='mb-0'>
                  {selectedUser ? selectedUser.nombre : 'Usuario no disponible'}
                </CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center my-50'>
                <div className='user-info-title'>
                  <Check className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Estado
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>
                  {selectedUser ? (selectedUser.status === 1 ? 'Activo' : 'Inactivo') : 'Estado no disponible'}
                </CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center my-50'>
                <div className='user-info-title'>
                  <Star className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Rol
                  </CardText>
                </div>
                <CardText className='text-capitalize mb-0'>
                  {selectedUser ? 'Usuario' : 'Rol no disponible'}
                </CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center my-50'>
                <div className='user-info-title'>
                  <Flag className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    País
                  </CardText>
                </div>
                <CardText className='mb-0'>No especificado</CardText>
              </div>
              <div className='d-flex flex-wrap align-items-center'>
                <div className='user-info-title'>
                  <Phone className='mr-1' size={14} />
                  <CardText tag='span' className='user-info-title font-weight-bold mb-0'>
                    Contacto
                  </CardText>
                </div>
                <CardText className='mb-0'>{selectedUser ? selectedUser.telefono : 'Número no disponible'}</CardText>
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default UserInfoCard
