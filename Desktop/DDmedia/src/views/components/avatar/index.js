import { forwardRef } from 'react'
import Proptypes from 'prop-types'
import { Badge } from 'reactstrap'
import classnames from 'classnames'

const Avatar = forwardRef((props, ref) => {
  // ** Props
  const {
    color,
    className,
    imgClassName,
    initials,
    size,
    badgeUp,
    content,
    icon,
    badgeColor,
    badgeText,
    img,
    imgHeight,
    imgWidth,
    status,
    tag: Tag,
    contentStyles,
    selectedUser,  // Asegúrate de pasar el usuario seleccionado a este componente
    ...rest
  } = props

  // ** Función para obtener las iniciales del nombre
  const getInitials = (str) => {
    if (!str || typeof str !== 'string' || !str.trim()) {
      return 'U' // Valor predeterminado si no es una cadena válida
    }
    return str[0].toUpperCase()  // Solo la primera inicial del nombre
  }
  
  // Usamos el nombre para obtener las iniciales
  const userName = selectedUser?.nombre || 'Desconocido'
  const userInitials = getInitials(userName)

  // ** Log para debug
  console.log('Content passed to Avatar:', content)

  return (
    <Tag
      className={classnames('avatar', {
        [className]: className,
        [`bg-${color}`]: color,
        [`avatar-${size}`]: size
      })}
      ref={ref}
      {...rest}
    >
      {img === false || img === undefined ? (
        <span
          className={classnames('avatar-content', {
            'position-relative': badgeUp
          })}
          style={contentStyles}
        >
          {initials ? userInitials : userName}  {/* Aquí solo mostramos el nombre o las iniciales */}

          {icon ? icon : null}
          {badgeUp ? (
            <Badge color={badgeColor ? badgeColor : 'primary'} className='badge-sm badge-up' pill>
              {badgeText ? badgeText : '0'}
            </Badge>
          ) : null}
        </span>
      ) : (
        <img
          className={classnames({
            [imgClassName]: imgClassName
          })}
          src={img}
          alt='avatarImg'
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
        />
      )}
      
      {status ? (
        <span
          className={classnames({
            [`avatar-status-${status}`]: status,
            [`avatar-status-${size}`]: size
          })}
        ></span>
      ) : null}
    </Tag>
  )
})

export default Avatar

// ** PropTypes
Avatar.propTypes = {
  imgClassName: Proptypes.string,
  className: Proptypes.string,
  src: Proptypes.string,
  tag: Proptypes.oneOfType([Proptypes.func, Proptypes.string]),
  badgeUp: Proptypes.bool,
  content: Proptypes.string,
  icon: Proptypes.node,
  contentStyles: Proptypes.object,
  badgeText: Proptypes.string,
  imgHeight: Proptypes.oneOfType([Proptypes.string, Proptypes.number]),
  imgWidth: Proptypes.oneOfType([Proptypes.string, Proptypes.number]),
  size: Proptypes.oneOf(['sm', 'lg', 'xl']),
  status: Proptypes.oneOf(['online', 'offline', 'away', 'busy']),
  badgeColor: Proptypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark',
    'light-primary', 'light-secondary', 'light-success', 'light-danger', 
    'light-info', 'light-warning', 'light-dark'
  ]),
  color: Proptypes.oneOf([
    'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark',
    'light-primary', 'light-secondary', 'light-success', 'light-danger',
    'light-info', 'light-warning', 'light-dark'
  ]),
  selectedUser: Proptypes.object // Asegúrate de pasar un objeto de usuario
}

// ** Default Props
Avatar.defaultProps = {
  tag: 'div'
}
