// Packages
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
// actionCreators
import { actions } from '../..';
const { setModal, setLanguage } = actions;

function HeaderHO(Header) {
  return class HigherOrderHeader extends React.Component {
    openLoginModal = () => {
      this.props.setModal('loginModal');
    };
    openRegistrationModal = () => {
      this.props.setModal('registrationModal');
    };
    setLanguage = language => {
      this.props.setLanguage(language);
    };

    render() {
      const functions = {
        openLoginModal: this.openLoginModal,
        openRegistrationModal: this.openRegistrationModal,
        setLanguage: this.setLanguage,
      };

      return <Header {...this.props} {...functions} />;
    }
  };
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  userSession: store.userSession,
  language: store.language,
});
// Pass actionCreators into props
const mapDispatchToProps = dispatch => bindActionCreators({ setModal, setLanguage }, dispatch);

export default function ReduxHeaderHO(Header) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(HeaderHO(Header));
}
