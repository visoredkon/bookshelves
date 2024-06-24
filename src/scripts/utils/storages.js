const STORAGE_KEY = "BOOKSHELF_APPS"

const isStorageExist = () => {
    if (typeof Storage === "undefined") {
        alert("Browser tidak mendukung local storage!")
        return false
    }

    return true
}

const saveData = books => {
    if (!isStorageExist()) {
        return
    }

    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
}

const loadDataFromStorage = (books, RENDER_EVENT) => {
    const serializedData = localStorage.getItem(STORAGE_KEY)

    if (!serializedData) {
        return
    }

    const data = JSON.parse(serializedData)

    for (const book of data) {
        books.push(book)
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

export { isStorageExist, saveData, loadDataFromStorage }
