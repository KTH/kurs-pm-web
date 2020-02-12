import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'

@inject(['routerStore'])
@observer
class Start extends Component {
  state = {
    buttonClicked: false,
  }

  toggleButton = () => this.setState({ buttonClicked: !this.state.buttonClicked })

  render() {
    const { message } = this.props.routerStore
    return (
      <Fragment>
        <h1 className="display-3">Node-web</h1>
        <h2>You are upp and running kth-node react!</h2>
        <hr className="my-2" />
        <h3>{`Message from routerStore: ${message}`}</h3>
        <button type="button" onClick={this.toggleButton}>
          Try me
        </button>
        <p>{this.state.buttonClicked ? 'Button works!' : ''}</p>
      </Fragment>
    )
  }
}

export default Start
