import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
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
  const component = render(<Blog blog={blog} user={user} />)

  expect(component.container).toHaveTextContent(
    'Go To Statement Considered Harmful'
  )
})
