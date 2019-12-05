import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const [filter, setFilter] = React.useState("");
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const { firebase, user } = React.useContext(FirebaseContext);
  const [links, setLinks] = React.useState([]);
  React.useEffect(() => {
    getInitialLinks();
  }, []);

  function getInitialLinks() {
    firebase.db
      .collection("links")
      .get()
      .then(snapShot => {
        const links = snapShot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        setLinks(links);
      });
  }

  function handleSearch(event) {
    event.preventDefault();
    const query = filter.toLowerCase();
    const matchedLinks = links.filter(link => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedLinks);
  }
  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={e => setFilter(e.target.value)} />
          <button> OK </button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
