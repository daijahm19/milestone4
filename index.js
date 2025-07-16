$(function () {
  let results = []
  let currentPage = 1
  let viewMode = 'grid'

  $('#search-btn').click(() => {
    const query = $('#search-box').val().trim()
    if (!query) return

    $.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`, (data) => {
      results = data.items || []
      currentPage = 1
      renderPage()
      setupPagination()
      $('#bookshelf-section').addClass('hidden')
    })
  })

  function renderPage() {
    $('#search-results').removeClass('grid list').addClass(viewMode).empty()
    const start = (currentPage - 1) * 10
    const books = results.slice(start, start + 10)
    books.forEach((book) => {
      const info = book.volumeInfo
      const rendered = Mustache.render($('#book-template').html(), {
        id: book.id,
        title: info.title,
        authors: (info.authors || []).join(', '),
        description: info.description || 'No description available.',
        infoLink: info.infoLink,
        thumbnail: info.imageLinks?.thumbnail || ''
      })
      $('#search-results').append(rendered)
    })
  }

  function setupPagination() {
    $('#pagination').empty()
    const totalPages = Math.min(5, Math.ceil(results.length / 10))
    for (let i = 1; i <= totalPages; i++) {
      const btn = $('<button>').text(i)
      if (i === currentPage) btn.addClass('active')
      btn.click(() => {
        currentPage = i
        renderPage()
        setupPagination()
      })
      $('#pagination').append(btn)
    }
  }

  $(document).on('click', '.book', function () {
    const bookData = {
      title: $(this).data('title'),
      authors: $(this).data('authors'),
      description: $(this).data('desc'),
      infoLink: $(this).data('link')
    }
    const detailHTML = Mustache.render($('#book-detail-template').html(), bookData)
    $('#book-details').html(detailHTML)
  })

  $('#grid-view').click(() => {
    viewMode = 'grid'
    $('#grid-view').addClass('active-view')
    $('#list-view').removeClass('active-view')
    renderPage()
  })

  $('#list-view').click(() => {
    viewMode = 'list'
    $('#list-view').addClass('active-view')
    $('#grid-view').removeClass('active-view')
    renderPage()
  })

  $('#toggle-bookshelf').click(() => {
    $('#bookshelf-section').toggleClass('hidden')
  })

  function loadBookshelf() {
    const fakeBooks = [
      {
        id: '1',
        title: 'Tips for Students',
        authors: ['Beatrice Noon'],
        description: 'A guide to help high school and college students.',
        infoLink: 'https://example.com/tips',
        thumbnail: ''
      },
      {
        id: '2',
        title: 'Hungry Hippocampus',
        authors: ['Janice Edwards'],
        description: 'Why do our brains need fuel?',
        infoLink: 'https://example.com/brain-book',
        thumbnail: ''
      },
      {
        id: '3',
        title: 'Dogs',
        authors: ['Chris Styles'],
        description: 'All about dogs.',
        infoLink: 'https://example.com/dogs',
        thumbnail: ''
      },
      {
        id: '4',
        title: 'Room Decor',
        authors: ['West Gone'],
        description: 'Best room decor for anyone.',
        infoLink: 'https://example.com/decor',
        thumbnail: ''
      }
    ]

    fakeBooks.forEach(book => {
      const rendered = Mustache.render($('#book-template').html(), {
        id: book.id,
        title: book.title,
        authors: book.authors.join(', '),
        description: book.description,
        infoLink: book.infoLink,
        thumbnail: book.thumbnail
      })
      $('#bookshelf').append(rendered)
    })
  }

  loadBookshelf()
})

  