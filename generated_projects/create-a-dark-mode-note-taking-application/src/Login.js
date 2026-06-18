import React, { Component } from "react";

/**
 * Login component renders a simple authentication form.
 * It maintains local state for the username and password fields and
 * notifies the parent component when a login attempt succeeds.
 *
 * Props
 * -----
 * onLogin   – Callback invoked when the user successfully logs in.
 * username  – (optional) initial username value.
 * password  – (optional) initial password value.
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username || "",
      password: props.password || "",
      error: "",
    };
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username.trim() || !password) {
      this.setState({ error: "Both username and password are required." });
      return;
    }
    // Clear error and inform parent.
    this.setState({ error: "" }, () => {
      if (typeof this.props.onLogin === "function") {
        this.props.onLogin();
      }
    });
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <div className="login-form" style={{ maxWidth: "300px", margin: "0 auto" }}>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="username" style={{ display: "block" }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={this.handleChange("username")}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password" style={{ display: "block" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={this.handleChange("password")}
              style={{ width: "100%" }}
            />
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          )}
          <button type="submit" style={{ width: "100%" }}>
            Log In
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
