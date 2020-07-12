import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const [blog, setBlog] = useState(props.blog)
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const Like = () => {
    const liked = props.handleLike({
      ...blog,
      likes: blog.likes + 1,
    })
    if (liked) setBlog({ ...blog, likes: blog.likes + 1 })
  }

  const showDelete =
    blog.user.username === props.user.username
      ? { display: '' }
      : { display: 'none' }

  // console.log(blog);
  return (
    <div className="blog">
      <p className="notToggled">
        <span className="title">{blog.title}</span>{' '}
        <span className="author">{blog.author}</span>
        <span>
          <button
            className="toggle-blog-view"
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'hide' : 'show'}
          </button>
        </span>
      </p>

      <div className="toggled" style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <span>
            <button className="likeButton" onClick={() => Like()}>
              like
            </button>
          </span>
        </div>
        <div>{blog.user.username}</div>
        <button
          className="deleteButton"
          style={showDelete}
          onClick={() => props.handleDelete(blog)}
        >
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
