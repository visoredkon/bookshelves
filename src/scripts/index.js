import { findBook, findBookIndex } from "./utils/finds.js"
import { isStorageExist, loadDataFromStorage, saveData } from "./utils/storages.js"

const books = []
const RENDER_EVENT = "render-book"

const addBook = () => {
    const title = document.getElementById("input-book-title").value
    const author = document.getElementById("input-book-author").value
    const year = document.getElementById("input-book-year").value
    const isComplete = document.getElementById("input-book-is-completed").checked

    const bookObject = {
        id: Number(new Date()),
        title,
        author,
        year: parseInt(year, 10),
        isComplete,
    }

    books.push(bookObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData(books)

    const confirmation = confirm("Buku berhasil ditambahkan, ingin pindah ke halamn bookshelf?")

    if (!confirmation) {
        return
    }

    window.location.hash = "bookshelf"
}

const removeBook = bookId => {
    const confirmation = confirm("Apakah anda yakin ingin menghapus buku?")

    if (!confirmation) {
        return
    }

    const bookTarget = findBookIndex(books, bookId)

    books.splice(bookTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData(books)
}

const updateBookCompleteStatus = (bookId, status) => {
    const bookTarget = findBook(books, bookId)

    if (!bookTarget) {
        return alert("Buku tidak ditemukan!")
    }

    bookTarget.isComplete = status
    document.dispatchEvent(new Event(RENDER_EVENT))
    return saveData(books)
}

const createElement = (tagName, className, innerText, eventListeners) => {
    const element = document.createElement(tagName)

    if (className) {
        element.classList.add(className)
    }

    if (innerText) {
        element.innerText = innerText
    }

    if (eventListeners) {
        for (const [event, listener] of Object.entries(eventListeners)) {
            element.addEventListener(event, listener)
        }
    }

    return element
}

const makeBook = bookObject => {
    const { id, title, author, year, isComplete } = bookObject

    const textTitle = createElement("h3", null, title)
    const textAuthor = createElement("p", null, `Penulis: ${author}`)
    const textYear = createElement("p", null, `Tahun: ${year}`)
    const breakLine = createElement("br")

    const textContainer = createElement("article", "book-item")
    textContainer.append(textTitle, textAuthor, textYear, breakLine)

    const container = createElement("div", "action")
    textContainer.appendChild(container)

    const bookStatusButton = createElement("button", "green", isComplete ? "Belum selesai dibaca" : "Selesai dibaca", {
        click: () => updateBookCompleteStatus(id, !isComplete),
    })

    const trashButton = createElement("button", "red", "Hapus buku", { click: () => removeBook(id) })

    container.append(bookStatusButton, trashButton)

    return textContainer
}

const searchReset = () => {
    document.getElementById("search-reset").style.display = "none"
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const searchBook = () => {
    const searchTitle = document.getElementById("search-book-title").value.toLowerCase()
    const incompleteBookList = document.getElementById("incompleted-bookshelf-list")
    const completeBookList = document.getElementById("completed-bookshelf-list")
    const searchResetButton = document.getElementById("search-reset")

    incompleteBookList.innerHTML = ""
    completeBookList.innerHTML = ""

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)

        if (bookItem.title.toLowerCase().includes(searchTitle)) {
            if (bookItem.isComplete) {
                completeBookList.append(bookElement)
            } else {
                incompleteBookList.append(bookElement)
            }
        }
    }

    searchResetButton.style.display = "inline-block"
    searchResetButton.addEventListener("click", () => {
        searchReset()
    })
    window.location.hash = "bookshelf"
}

document.addEventListener("DOMContentLoaded", () => {
    const firstActived = document.querySelectorAll("header > nav > ul > li > a")

    for (const element of firstActived) {
        if (element.classList.contains("active")) {
            window.location.hash = element.getAttribute("href")
            break
        }
    }

    let tempHash = window.location.hash

    const setActiveMenuItem = () => {
        const currentHash = window.location.hash
        const tempNav = document.querySelector(`header > nav > ul > li > a[href="${tempHash}"]`)
        const currentNav = document.querySelector(`header > nav > ul > li > a[href="${currentHash}"]`)

        if (tempNav) {
            tempNav.classList.remove("active")
        }

        if (currentNav) {
            currentNav.classList.add("active")
        }

        tempHash = currentHash
    }

    window.addEventListener("hashchange", setActiveMenuItem)

    if (isStorageExist()) {
        loadDataFromStorage(books, RENDER_EVENT)
    }

    const actions = {
        "input-book": addBook,
        "search-book": searchBook,
    }

    Object.keys(actions).forEach(element => {
        document.getElementById(element).addEventListener("submit", event => {
            event.preventDefault()
            actions[element]()
        })
    })
})

document.addEventListener(RENDER_EVENT, () => {
    const incompleteBookList = document.getElementById("incompleted-bookshelf-list")
    const completeBookList = document.getElementById("completed-bookshelf-list")

    incompleteBookList.innerHTML = ""
    completeBookList.innerHTML = ""

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem)

        if (bookItem.isComplete) {
            completeBookList.append(bookElement)
        } else {
            incompleteBookList.append(bookElement)
        }
    }
})
