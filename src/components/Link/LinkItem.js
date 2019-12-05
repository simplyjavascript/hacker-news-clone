import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getDomain } from "../../utils";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { FirebaseContext } from "../../firebase";
function LinkItem({ link, index, showCount, history }) {
  const { firebase, user } = React.useContext(FirebaseContext);
  function handleVote() {
    if (!user) {
      history.push("/login");
    } else {
      const voteRef = firebase.db.collection("links").doc(link.id);
      voteRef.get().then(doc => {
        if (doc.exists) {
          const prevVotes = doc.data().votes;
          const vote = {
            votedBy: { id: user.uid, name: user.displayName }
          };
          const updatedVotes = [...prevVotes, vote];
          const voteCount = updatedVotes.length;
          voteRef.update({ votes: updatedVotes, voteCount });
        }
      });
    }
  }
  function handleDeleteLink() {
    const linkRef = firebase.db.collection("links").doc(link.id);
    linkRef
      .delete()
      .then(() => {
        console.log("Document deleted successfully!");
      })
      .catch(err => {
        console.error("Deletion aborted");
      });
  }
  const postedByAuthUser = user && user.uid === link.postedBy.id;
  return (
    <div className="flex items-start mt2">
      <div className="flex items-center">
        {showCount && <span className="gray"> {index}</span>}
        <div onClick={handleVote} className="vote-button">
          ▲
        </div>
      </div>
      <div className="ml1">
        <div>
          <a className="black no-underline" href={link.url}>
            {link.description}
          </a>
          <span className="link"> ({getDomain(link.url)})</span>
        </div>
        <div className="f6 lh-copy gray">
          {link.voteCount} votes by {link.postedBy.name}
          {distanceInWordsToNow(link.created)}
          {" | "}
          <Link to={`/link/${link.id}`}>
            {link.comments.length > 0
              ? `${link.comments.length} comments`
              : "discuss"}
          </Link>
          {postedByAuthUser && (
            <>
              {" | "}
              <span onClick={handleDeleteLink} className="delete-button">
                {" "}
                delete
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(LinkItem);
