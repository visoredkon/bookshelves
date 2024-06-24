const findBook = (books, bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem
        }
    }

    return null
}

const findBookIndex = (books, bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }

    return null
}

export { findBook, findBookIndex }
