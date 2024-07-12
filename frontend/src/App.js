import "./App.css";
import useBookSearch from "./useBookSearch";
import { useState, useRef, useCallback } from "react";
/*1) You create an IntersectionObserver by calling its constructor and passing a callback function.
 This callback function receives the entries array as an argument.*/
/*2) You use the observe method of the IntersectionObserver instance to start observing 
a target element. */
/*3)When the visibility of a target element changes (e.g., it enters or exits the viewport),
 the IntersectionObserver's callback is invoked. The browser creates and provides 
 the entries array, containing IntersectionObserverEntry objects for each observed target element 
 whose visibility has changed. */
function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const observer = useRef(null);
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);
  const lastBookELementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        //entries is the array of everything that its watching as soon as they become visible, they
        //are in it
        if (entries[0].isIntersecting && hasMore) {
          console.log("visible");
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [loading, hasMore]
  );
  // now what happens is whenever our reference element is created it will call the function inside
  //usecallback with the reference to the element we are using

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
      />
      {books.map((book, i) => {
        if (books.length === i + 1) {
          return (
            <div key={book} ref={lastBookELementRef}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && error}</div>
    </>
  );
}

export default App;
