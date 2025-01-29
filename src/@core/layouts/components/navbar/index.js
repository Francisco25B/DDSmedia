// ** React Imports
import { Fragment } from 'react'

// ** Dropdowns Imports
import IntlDropdown from './IntlDropdown'
import CartDropdown from './CartDropdown'
import UserDropdown from './UserDropdown'
import NavbarSearch from './NavbarSearch'
import NotificationDropdown from './NotificationDropdown'

// ** Custom Components
import NavbarBookmarks from './NavbarBookmarks'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
  
  }

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
        <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <IntlDropdown />
        
        <NavbarSearch />
        <CartDropdown />
        <NotificationDropdown />
        <UserDropdown />
      </ul>
    </Fragment>
  )
}

export default ThemeNavbar
