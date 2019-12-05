import React from "react";
import useFormValidation from "./../Auth/useFormValidation";
import validateCreateLink from "./../Auth/validateCreateLink";
import { FirebaseContext } from "../../firebase";

const initialState = {
  description: "",
  url: ""
};
function CreateLink(props) {
  const { firebase, user } = React.useContext(FirebaseContext);
  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    initialState,
    validateCreateLink,
    handleCreateLink
  );
  function handleCreateLink() {
    if (!user) {
      props.history.push("/login");
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };
      firebase.db.collection("links").add(newLink);
      props.history.push("/");
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-column mt3">
        <input
          onChange={handleChange}
          name="description"
          placeholder="Description"
          type="text"
          value={values.description}
          className={errors.description && "error-input"}
        />
        {errors.description && (
          <p className="error-text"> {errors.description}</p>
        )}
        <input
          onChange={handleChange}
          name="url"
          placeholder="URL"
          type="url"
          value={values.url}
        />
        {errors.url && <p className="error-text"> {errors.url}</p>}
        <button type="submit" className="button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateLink;
