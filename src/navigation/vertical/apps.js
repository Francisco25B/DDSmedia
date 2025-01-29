import { Home, DollarSign, FileText, BarChart, Users, Circle } from 'react-feather'

export default [
  {
    header: 'Acciones'
  },
  {
    id: 'email',
    title: 'Ingresos',
    icon: <Home size={20} />,  // Ícono de una casa o templo
    navLink: '/apps/email'
  },
  {
    id: 'chat',
    title: 'Egresos',
    icon: <DollarSign size={20} />,  // Ícono de billetes
    navLink: '/apps/chat'
  },
  {
    id: 'todo',
    title: 'Estado Resultado',
    icon: <BarChart size={20}/>,  // Ícono de hoja con gráficos
    navLink: '/apps/todo'
  },
  {
    id: 'calendar',
    title: 'Reporte General',
    icon: <FileText size={20}  />,  // Ícono de gráficos (estadísticas)
    navLink: '/apps/calendar'
  },
  {
    id: 'list',
    title: 'Usuarios',
    icon: <Users size={20} />,
    navLink: '/apps/user/list'  // Ícono de grupo de personas
  }
]
