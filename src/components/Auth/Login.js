import React, { useState } from "react";
import useFormValidation from "./useFormValidation";
import { Link } from "react-router-dom";
import validateLogin from "./validateLogin";

import firebase from "./../../firebase";
const INIT_STATE = {
  name: "",
  email: "",
  password: ""
};
function Login(props) {
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmitting
  } = useFormValidation(INIT_STATE, validateLogin, authenticateUser);

  const [login, setLogin] = useState(true);
  const [fbError, setFbError] = useState(null);
  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      props.history.push("/");
    } catch (error) {
      console.log("Auth error>>>", error);
      setFbError(error.message);
    }
  }

  return (
    <div>
      <h2 className="mv3"> {login ? "Login" : "Create Account"} </h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && (
          <input
            name="name"
            type="text"
            onChange={handleChange}
            placeholder="Your name"
            value={values.name}
          />
        )}
        <input
          name="email"
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          className={errors.email && "error-input"}
          placeholder="Your email"
          value={values.email}
        />
        {errors.email && <p className="error-text"> {errors.email} </p>}
        <input
          name="password"
          onChange={handleChange}
          onBlur={handleBlur}
          type="password"
          className={errors.password && "error-input"}
          placeholder="Your password"
          value={values.password}
        />
        {errors.password && <p className="error-text"> {errors.password} </p>}
        {fbError && <p className="error-text"> {fbError} </p>}
        <div className="flex mt3">
          <button
            disabled={isSubmitting}
            style={{ background: isSubmitting ? "grey" : "orange" }}
            type="submit"
            className="button pointer mr2"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setLogin(prevLogin => !prevLogin)}
            className="button pointer"
          >
            {login ? "Create an account" : "already have an account?"}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot"> Reset password? </Link>
      </div>
    </div>
  );
}

export default Login;
