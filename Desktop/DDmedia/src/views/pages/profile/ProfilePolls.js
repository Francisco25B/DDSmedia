import { Fragment } from 'react'
import { Card, CardBody, CardText, Progress, CustomInput, UncontrolledTooltip } from 'reactstrap'

const ProfilePolls = ({ data }) => {
  const renderOptions = () => {
    return data.map(option => {
      return (
        <div key={option.name} className="profile-polls-info mt-2">
          <div className="d-flex justify-content-between">
            <CustomInput
              type="radio"
              id={`radio-${option.name.toLowerCase()}`}
              name="customRadio"
              label={option.name}
            />
            <div className="text-right">{option.result}</div>
          </div>
          <Progress className="my-50" value={option.result.replace('%', '').trim()} />
          <div className="avatar-group my-1">
            {option.votedUser.map(user => {
              // Accedemos al nombre del usuario directamente
              const userName = user.nombre || '' // Usamos 'nombre' porque no existe 'username'
              const formattedUserName = userName.toLowerCase().split(' ').join('-') // Formateamos el nombre

              return (
                <Fragment key={formattedUserName}>
                  {/* Tooltip sin imagen */}
                  <UncontrolledTooltip target={formattedUserName} placement="top">
                    {userName}
                  </UncontrolledTooltip>
                  <span id={formattedUserName} className="user-name">
                    {userName}
                  </span>
                </Fragment>
              )
            })}
          </div>
        </div>
      )
    })
  }

  return (
    <Card>
      <CardBody>
        <h5 className="mb-1">Polls</h5>
        <CardText className="mb-0">Who is the best actor in Marvel Cinematic Universe?</CardText>
        {renderOptions()}
      </CardBody>
    </Card>
  )
}

export default ProfilePolls
