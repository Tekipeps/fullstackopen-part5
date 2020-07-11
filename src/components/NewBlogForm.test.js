import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  let component // eslint-disable-line no-unused-vars

  test('5.16*: Blog list tests, step4', () => {
    const createBlog = jest.fn()
    component = render(<NewBlogForm createBlog={createBlog} />)
    const newBlog = {
      title: 'Blog Test',
      author: 'Tekipeps',
      url: 'flso.herokuapp.com',
    }

    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: { value: newBlog.title },
    })
    fireEvent.change(author, {
      target: { value: newBlog.author },
    })
    fireEvent.change(url, {
      target: { value: newBlog.url },
    })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Blog Test')
  })
})
