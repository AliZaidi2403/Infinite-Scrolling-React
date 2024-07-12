import { useEffect, useState } from "react";
function useBookSearch(query, pageNumber) {
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  if (books.length) console.log(books);
  useEffect(() => {
    setBooks([]);
  }, [query]);
  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchingData = async () => {
      try {
        const res = await fetch(
          `http://openlibrary.org/search.json?q=${query}&page=${pageNumber}`,
          { signal }
        );
        if (!res.ok) {
          throw new Error("Network response not ok");
        }
        const data = await res.json();
        setBooks((prevBooks) => [
          ...new Set([...prevBooks, ...data.docs.map((b) => b.title)]),
        ]);
        setHasMore(data.docs.length > 0);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchingData();
    return () => {
      abortController.abort();
    };
  }, [pageNumber, query]);

  return { error, books, loading, hasMore };
}

export default useBookSearch;
