import { useState, useContext, Fragment } from 'react'
import classnames from 'classnames'
import Avatar from '@components/avatar'
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee } from 'react-feather'
import {
  Alert,
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button,
  UncontrolledTooltip
} from 'reactstrap'
import '@styles/base/pages/page-auth.scss'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Bienvenidos, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as an {role} user to Vuexy. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const Login = props => {
  const [skin, setSkin] = useSkin()
  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = data => {
    if (isObjEmpty(errors)) {
      useJwt
        .login({ email, password })
        .then(res => {
          const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          dispatch(handleLogin(data))
          ability.update(res.data.userData.ability)
          history.push(getHomeRouteForLoggedInUser(data.role))
          toast.success(
            <ToastContent name={data.fullName || data.username || 'John Doe'} role={data.role || 'admin'} />,
            { transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div className="container">
              <div className="card">
                <a className="login">Log in</a>
                <form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
                  <div className="inputBox">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <span className="user">Usuario</span>
                  </div>
                  <div className="inputBox" style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <span className="password">Contraseña</span>
                    {/* Botón de ver/ocultar contraseña */}
                    <div className="toggle-border">
                      <input 
                        id="toggle-password" 
                        type="checkbox" 
                        checked={showPassword} 
                        onChange={() => setShowPassword(!showPassword)} 
                      />
                      <label htmlFor="toggle-password">
                        <div className="handle"></div>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className="enter">Enter</button>
                </form>
              </div>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login