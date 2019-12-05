export default function validateLogin(values) {
  let errors = {};

  // email errors
  if (!values.email) {
    errors.email = "Email reqd.";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email";
  }

  // password errors
  if (!values.password) {
    errors.password = "Password reqd.";
  } else if (values.password.length < 6) {
    errors.password = "Password must be atleast 6 chars";
  }

  return errors;
}
