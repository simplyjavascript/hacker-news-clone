import React from "react";
import { FirebaseContext } from "../../firebase";

function ForgotPassword() {
  const { firebase } = React.useContext(FirebaseContext);
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState("");
  const [isPasswordReset, setIsPasswordReset] = React.useState(false);
  const [passwordResetError, setPasswordResetError] = React.useState(null);
  async function handleResetPassword() {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setPasswordResetError(null);
    } catch (error) {
      console.error(error);
      setPasswordResetError(error.message);
      setIsPasswordReset(false);
    }
  }
  return (
    <div>
      <input
        onChange={e => setResetPasswordEmail(e.target.value)}
        className="input"
        placeholder="Provide your email"
        type="email"
      />
      <div>
        <button
          onClick={() => handleResetPassword(resetPasswordEmail)}
          className="button"
        >
          Reset password
        </button>
      </div>
      {isPasswordReset && <p> Password reset mail on your way! </p>}
      {passwordResetError && (
        <p className="error-text"> {passwordResetError} </p>
      )}
    </div>
  );
}

export default ForgotPassword;
