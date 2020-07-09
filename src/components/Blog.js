import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const [blog, setBlog] = useState(props.blog)
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const handleLike = async () => {
    try {
      const newBlog = await blogService.like({
        ...blog,
        likes: blog.likes + 1,
      })
      setBlog(newBlog)
      console.log('success')
    } catch (error) {
      console.log(error.response)
    }
  }

  const showDelete =
    blog.user.username === props.user.username
      ? { display: '' }
      : { display: 'none' }

  // console.log(blog);
  return (
    <div className="blog">
      <p>
        {blog.title} {blog.author}{' '}
        <span>
          <button onClick={() => setVisible(!visible)}>
            {visible ? 'hide' : 'show'}
          </button>
        </span>
      </p>

      <div style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <span>
            <button onClick={() => handleLike()}>like</button>
          </span>
        </div>
        <div>{blog.user.username}</div>
        <button style={showDelete} onClick={() => props.handleDelete(blog)}>
          delete
        </button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
