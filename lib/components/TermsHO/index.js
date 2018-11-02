// Packages
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
// actionCreators / helpers
import { languageSelector } from '../..';

function TermsHO(Terms) {
  return class HigherOrderTerms extends React.Component {
    render() {
      const helpers = {
        languageSelector,
      };
      return <Terms {...this.props} {...helpers} />;
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
