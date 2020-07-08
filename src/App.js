import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import loginService from "./services/login";
import NewBlogForm from "./components/NewBlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState({});

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (error) {
      setNotification({
        type: "error",
        message: `${error.response.data.error}`,
      });
    }
    setTimeout(() => {
      setNotification({});
    }, 4000);
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      blogService.setToken(user.token);
      const newBlog = await blogService.create({ title, author, url });

      setBlogs([...blogs, newBlog]);
      setTitle("");
      setAuthor("");
      setUrl("");
      setNotification({
        type: "success",
        message: `a new blog ${newBlog.title} by ${newBlog.author}`,
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: `${error.response.data.error}`,
      });
    }
    setTimeout(() => {
      setNotification({});
    }, 4000);
  };

  if (user === null) {
    return (
      <div>
        <Notification type={notification.type} message={notification.message} />

        <LoginForm
          handleLogin={handleLogin}
          setUsername={setUsername}
          username={username}
          setPassword={setPassword}
          password={password}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification type={notification.type} message={notification.message} />
      <p>
        {user.username} logged in{" "}
        <button
          onClick={() => {
            window.localStorage.clear();
            setUser(null);
          }}
        >
          Logout
        </button>
      </p>
      <h2>create new</h2>
      <NewBlogForm
        handleNewBlog={handleNewBlog}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        url={url}
        setUrl={setUrl}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
