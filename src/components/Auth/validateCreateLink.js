export default function validateCreateLink(values) {
  let errors = {};

  // description errors
  if (!values.description) {
    errors.description = "description reqd.";
  } else if (values.description.length < 6) {
    errors.description = "Description must be atleast 6 characters";
  }

  // URL errors
  if (!values.url) {
    errors.url = "URL reqd.";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = "URL must be a valid one";
  }

  return errors;
}
