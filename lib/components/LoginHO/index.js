// Packages
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
// actionCreators
import { actions } from '../..';
const { logInUser, getUserProfile, getUserWallets, setModal } = actions;

function LoginHO(Login) {
  return class HigherOrderLogin extends React.Component {
    state = {
      username: '',
      password: '',
    };

    handleChange = event => {
      this.setState({
        [event.target.name]: event.target.value,
      });
    };

    submitLogin = () => {
      const { username, password } = this.state;
      this.props.logInUser({ username, password });
    };

    handleGetUserData = () => {
      const { playerId, session } = this.props.userSession;
      this.props.getUserProfile({ playerId, session });
      this.props.getUserWallets({ playerId, session });
    };

    closeModals = () => {
      this.props.setModal('none');
    };

    render() {
      const { username, password } = this.state;
      const state = { username, password };
      const functions = {
        handleChange: this.handleChange,
        submitLogin: this.submitLogin,
        handleGetUserData: this.handleGetUserData,
        closeModals: this.closeModals,
      };

      return <Login {...this.props} {...state} {...functions} />;
    }
  };
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  userSession: store.userSession,
});
// Pass actionCreators into props
const mapDispatchToProps = dispatch =>
  bindActionCreators({ logInUser, getUserProfile, getUserWallets, setModal }, dispatch);

export default function ReduxLoginHO(Login) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(LoginHO(Login));
}
