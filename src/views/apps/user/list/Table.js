import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './Sidebar'
import { FaPlus } from 'react-icons/fa'


// ** Columns
import { columns } from './columns'

// ** Store & Actions
import { getAllData, getData, fetchUser } from '../store/action'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { selectThemeColors } from '@utils'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button } from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Buscar:
            </Label>
            <Input
              id='search-invoice'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
              placeholder="Buscar... "
            />
          </div>
          <Button.Ripple color='primary' onClick={toggleSidebar}>
  <FaPlus size={18} className='mr-50' /> 
  Nuevo Usuario
</Button.Ripple>

        </Col>
      </Row>
    </div>
  )
}

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Selecciona Rol' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Selecciona Estado', number: 0 })

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount or when filters change
  useEffect(() => {
    dispatch(getAllData())
    dispatch(
      getData({
        page: currentPage,             // Paginación: página actual
        perPage: rowsPerPage,          // Paginación: registros por página
        tipo_usuario_id: currentRole.value, // Usamos tipo_usuario_id en lugar de role
        status: currentStatus.value,   // Filtrar por estado
        q: searchTerm                  // Filtrar por término de búsqueda
      })
    )
  }, [dispatch, currentPage, rowsPerPage, currentRole, currentStatus, searchTerm])
  

  // ** Function to handle search query change
  const handleFilter = val => {
    setSearchTerm(val)  // Actualiza el término de búsqueda
    dispatch(
      getData({
        page: currentPage,
        perPage: rowsPerPage,
        tipo_usuario_id: currentRole.value, // Mantenemos el filtro de tipo_usuario_id
        status: currentStatus.value,         // Mantenemos el filtro de estado
        q: val                               // Actualiza los resultados con el nuevo término de búsqueda
      })
    )
  }
  

  // ** Table data to render
  const dataToRender = () => {
    if (store.data && Array.isArray(store.data)) {
      return store.data
    } else if (store.allData && Array.isArray(store.allData.data)) {
      return store.allData.data
    } else {
      return []
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filtro de Búsqueda</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={[
                  { value: '', label: 'Todos' },
                  { value: 1, label: 'Cliente' },
                  { value: 2, label: 'Adminstrador' },
                  { value: 3, label: 'Proveedor' }
                ]}
                value={currentRole}
                onChange={data => setCurrentRole(data)} // Actualizamos el rol seleccionado
              />
            </Col>
            <Col md='4'>
              <Select
                isClearable={false}
                theme={selectThemeColors}
                className='react-select'
                classNamePrefix='select'
                options={[
                  { value: 1, label: 'Activo' },
                  { value: '', label: 'Todos' },
                 
                  { value: 0, label: 'Inactivo' }
                ]}
                value={currentStatus}
                onChange={data => setCurrentStatus(data)} // Actualizamos el estado seleccionado
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          columns={columns}
          sortIcon={<ChevronDown />}
          className='react-dataTable'
          paginationComponent={() => (
            <ReactPaginate
              previousLabel={''}
              nextLabel={''}
              pageCount={Math.ceil(store.total / rowsPerPage) || 1}
              activeClassName='active'
              forcePage={currentPage - 1}
              onPageChange={page => setCurrentPage(page.selected + 1)}
              containerClassName={'pagination react-paginate'}
            />
          )}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              toggleSidebar={toggleSidebar}
              handlePerPage={e => setRowsPerPage(Number(e.target.value))}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
            />
          }
        />
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default UsersList
