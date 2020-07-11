import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component // eslint-disable-line no-unused-vars
  const blog = {
    likes: 11,
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    user: {
      username: 'dodo',
      name: 'dodo',
      id: '5f052eea5550839823b25410',
    },
    id: '5f0671c87a5b5b27a719ad38',
  }
  const user = {
    username: 'dodo',
    name: 'dodo',
    id: '5f052eea5550839823b25410',
  }

  beforeEach(() => {
    component = render(<Blog blog={blog} user={user} />)
  })

  test('5.13: Blog list tests, step1', () => {
    const notToggledDiv = component.container.querySelector('.notToggled')
    expect(notToggledDiv).not.toHaveStyle('display: none')
    expect(notToggledDiv).toHaveTextContent(blog.title)
    expect(notToggledDiv).toHaveTextContent(blog.author)
    expect(notToggledDiv).not.toHaveTextContent(blog.url)
    expect(notToggledDiv).not.toHaveTextContent(blog.likes)
  })

  test('5.14: Blog list tests, step2', () => {
    const toggledDiv = component.container.querySelector('.toggled')
    expect(toggledDiv).toHaveStyle('display: none')

    const button = component.getByText('show')
    fireEvent.click(button)

    expect(toggledDiv).not.toHaveStyle('display: none')
  })

  test('5.15: Blog list tests, step3', () => {
    const mockHandler = jest.fn()
    component = render(
      <Blog blog={blog} user={user} handleLike={mockHandler} />
    )
    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
