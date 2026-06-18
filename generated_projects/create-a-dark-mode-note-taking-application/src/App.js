import React, { Component } from "react";
import Note from "./Note";
import Login from "./Login";

/**
 * Main application component.
 * Manages authentication state and renders either the Login component
 * or the Note component based on whether the user is logged in.
 */
class App extends Component {
  constructor(props) {
    super(props);
    // Initial state: user is not logged in.
    this.state = {
      loggedIn: false,
    };
  }

  /**
   * Callback invoked by the Login component when authentication succeeds.
   * It updates the local state to indicate that the user is logged in.
   */
  handleLogin = () => {
    this.setState({ loggedIn: true });
  };

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        {loggedIn ? (
          <Note />
        ) : (
          <Login onLogin={this.handleLogin} />
        )}
      </div>
    );
  }
}

export default App;
