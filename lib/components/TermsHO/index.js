// Packages
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
// actionCreators
import { actions } from '../..';
const {} = actions;

function TermsHO(Terms) {
  return class HigherOrderTerms extends React.Component {
    render() {
      return <Terms {...this.props} />;
    }
  };
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  language: store.language,
});
// Pass actionCreators into props
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default function ReduxTermsHO(Terms) {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TermsHO(Terms));
}
