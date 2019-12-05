import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";
import axios from "axios";
function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext);
  const [links, setLinks] = React.useState([]);
  const [cursor, setCursor] = React.useState(null);
  const isNewPage = props.location.pathname.includes("new");
  const isTopPage = props.location.pathname.includes("top");
  const page = +props.match.params.page;
  React.useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, page]);

  function getLinks() {
    const hasCursor = Boolean(cursor);
    if (isTopPage) {
      return firebase.db
        .collection("links")
        .orderBy("voteCount", "desc")
        .limit(2)
        .onSnapshot(handleSnapshot);
    } else if (page === 1) {
      // onSnapshot sets up continuous listening
      return firebase.db
        .collection("links")
        .orderBy("created", "desc")
        .limit(2)
        .onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      return firebase.db
        .collection("links")
        .orderBy("created", "desc")
        .limit(2)
        .startAfter(cursor.created)
        .onSnapshot(handleSnapshot);
    } else {
      const offset = page * 2 - 2;
      axios
        .get(
          `https://us-central1-hacker-news-hooks-e1f82.cloudfunctions.net/linksPagination?offset=${offset}`
        )
        .then(response => {
          const links = response.data;
          const lastLink = links[links.length - 1];
          setLinks(links);
          setCursor(lastLink);
        });
      return () => {};
    }
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    const lastLink = links[links.length - 1];
    setLinks(links);
    setCursor(lastLink);
  }

  function visitPrevPage() {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`);
    }
  }

  function visitNextPage() {
    if (page <= links.length / 2) {
      props.history.push(`/new/${page + 1}`);
    }
  }
  const pageIndex = page ? (page - 1) * 2 + 1 : 0;
  return (
    <div>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className="pagination">
          <div onClick={visitPrevPage} className="pointer mr2">
            Previous
          </div>
          <div onClick={visitNextPage} className="pointer">
            Next
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkList;
