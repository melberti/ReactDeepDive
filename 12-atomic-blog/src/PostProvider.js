import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

const PostContext = createContext();

function PostProvider({ children }) {
  //  const PostContext = useContext(PostContext);

  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost()),
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  //memo-ize the provider
  //so it does not re-render when dark mode is changed
  //which causes app to re-render
  //which causes the provider to re-render
  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      onClearPosts: handleClearPosts,
      onAddPost: handleAddPost,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, searchQuery]);
  //as for the dependency array, handleAddPost and handleClearPosts are defined inside PostProvider
  //and do not have dependencies on any state variables or props.
  //Because they don't depend on anything that could change over time,
  //they need not be included in the DA.
  //When using useMemo, its essential to include in the DA only the values that the
  //memoized value depends on. In this case, searchPosts and searchQuery
  //are the state values being used to compute the value, so they are included.
  //From Claude Sonnet:
  //handleAddPost and handleClearPosts are recreated onevery render, creating
  //new function references each time. Including them in the DA would cause
  //useMemo to run on every render, defeating its optimization purpose.
  //Since they use stable references (state setters), omitting them from dependencies
  //is safe. For better optimization, these functions could be wrapped
  //with useCallback.

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

function usePostContext() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("PostContext accessed outside of PostProvider");
  return context;
}

export { PostProvider, usePostContext };
