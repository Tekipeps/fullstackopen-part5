import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({})
  const blogFormRef = useRef()

  useEffect(() => {
    const initailBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      } catch (error) {
        console.log(error.response)
      }
    }
    initailBlogs()
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification({
        type: 'error',
        message: `${error.response.data.error}`,
      })
      console.log(error.response)
      setUsername('')
      setPassword('')
    }
    setTimeout(() => {
      setNotification({})
    }, 4000)
  }

  const createBlog = async (blog) => {
    try {
      blogService.setToken(user.token)
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()
      setNotification({
        type: 'success',
        message: `a new blog ${newBlog.title} by ${newBlog.author}`,
      })
    } catch (error) {
      setNotification({
        type: 'error',
        message: `${error.response.data.error}`,
      })
    }
    await setTimeout(() => {
      setNotification({})
    }, 4000)
  }
  const handleLike = async (blog) => {
    try {
      await blogService.like(blog)
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (blog) => {
    try {
      const choice = window.confirm(`Delete ${blog.title}`)
      if (choice) {
        blogService.setToken(user.token)
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
        setNotification({
          type: 'success',
          message: 'Deleted Successfully',
        })
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: `${error.response.data.error}`,
      })
    }
    await setTimeout(() => {
      setNotification({})
    }, 4000)
  }

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
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification type={notification.type} message={notification.message} />
      <p>
        {user.username} logged in{' '}
        <button
          onClick={() => {
            window.localStorage.clear()
            setUser(null)
          }}
        >
          Logout
        </button>
      </p>
      <h2>create new</h2>
      <Togglable buttonLabel="New Blog" ref={blogFormRef}>
        <NewBlogForm createBlog={createBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleDelete={handleDelete}
          handleLike={handleLike}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
