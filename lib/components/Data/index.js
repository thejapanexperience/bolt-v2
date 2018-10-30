// Packages
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Components
import UserSessionDisplay from './UserSessionDisplay';
import GamesDisplay from './GamesDisplay';
import WinnersFeedDisplay from './WinnersFeedDisplay';
// actionCreators

class Data extends React.Component {
  jsonArrayRender(array, className, selector = false) {
    return (
      <div className={className}>
        {array.map((data, i) => {
          if (selector) {
            data = data[selector];
          }
          return (
            <div key={i}>
              <div className="pre">{JSON.stringify(data, null, 2)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  jsonRender(data) {
    return (
      <div className="userSessionData">
        <div className="pre">{JSON.stringify(data, null, 2)}</div>
      </div>
    );
  }

  render() {
    const { className, winnersFeed, games, userSession, userProfile, userWallets } = this.props;

    let userSessionDisplay = 'No User';
    let gamesDisplay = 'No Games';
    let winnersFeedDisplay = 'No Winners';

    if (userSession) {
      userSessionDisplay = this.jsonRender(userSession);
    }

    if (games.length > 0) {
      gamesDisplay = this.jsonArrayRender(games, 'gamesData', 'displayName');
    }

    if (winnersFeed.length > 0) {
      winnersFeedDisplay = this.jsonArrayRender(winnersFeed, 'winnersFeedData');
    }

    console.log('userProfile', userProfile);
    console.log('userWallets', userWallets);

    return (
      <div className={className}>
        <div className="container h1Container">
          <h1>Data </h1>
        </div>

        <UserSessionDisplay userSessionDisplay={userSessionDisplay} />
        <GamesDisplay gamesDisplay={gamesDisplay} />
        <WinnersFeedDisplay winnersFeedDisplay={winnersFeedDisplay} />
      </div>
    );
  }
}

// Redux
// Get data from store and add to props
const mapStateToProps = store => ({
  winnersFeed: store.winnersFeed,
  games: store.games,
  userSession: store.userSession,
  userWallets: store.userWallets,
  userProfile: store.userProfile,
});
// Pass actionCreators into props
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Data);
