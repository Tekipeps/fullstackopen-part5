describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'admin',
      name: 'admin',
      password: 'admin',
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
    cy.get('button').contains('Login')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('admin')
      cy.get('#password').type('admin')
      cy.get('button').contains('Login').click()
      cy.contains('admin logged in')
      //   cy.get('button').contains('Logout').click()
    })
    it('fails with wrong credentials', function () {
      cy.get('#username').type('admin')
      cy.get('#password').type('password')
      cy.get('button').contains('Login').click()
      cy.contains('invalid username or password').should(
        'have.css',
        'color',
        'rgb(255, 0, 0)'
      )
    })
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'admin' })
    })

    it('A blog can be created', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('Type wars')
      cy.get('#author').type('Robert C. Martin')
      cy.get('#url').type(
        'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      )
      cy.get('#create-blog').contains('create').click()
      cy.get('.blog').contains('Type wars Robert C. Martin')
    })
    it('A user can like a blog', function () {
      cy.createBlog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url:
          'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      })
      cy.get('.toggle-blog-view').click()
      cy.get('.likeButton').click()
    })
    it('The owner can delete the blog', function () {
      cy.createBlog({
        title: 'First class tests',
        author: 'Robert C. Martin',
        url:
          'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      })
      cy.get('.toggle-blog-view').click()
      cy.get('.deleteButton').click()
    })

    it('The blogs are orderd by number of likes', function () {
      cy.createBlog({
        title: 'Blog1',
        author: 'test author',
        url: 'url',
      })
      cy.createBlog({
        title: 'Blog2',
        author: 'test author',
        url: 'url',
      })
      cy.get('.blog').contains('Blog1').parent().parent().as('blog1')
      cy.get('@blog1').contains('show').click()
      cy.get('@blog1').contains('like').click().click()

      cy.get('.blog').contains('Blog2').parent().parent().as('blog2')
      cy.get('@blog2').contains('show').click()
      cy.get('@blog2').contains('like').click().click().click().click()

      cy.visit('http://localhost:3000')
      const titles = []
      cy.get('.blog')
        .find('.notToggled')
        .each((blog) => {
          titles.push(blog.find('.title').text())
        })
        .then(() => {
          expect(titles).to.deep.equal(['Blog2', 'Blog1'])
        })
    })
  })
})
