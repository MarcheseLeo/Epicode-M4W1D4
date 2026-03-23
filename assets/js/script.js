
//ASync function to get the data from the API
const getAuthorSongs = async (author) => {
    try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${author}`)
        return await response.json()
    }
    catch (e) {
        printErrorMessage(e)
    }
}

//Function to return the ERR message by the API
const printErrorMessage = (e) => {
    console.log(e)
}

const filter = ['eminem', 'metallica', 'queen']

//Function to create the card of the song
const createSongCard = (song, author) => {

    let row
    if (filter.includes(author)) {
        row = document.getElementById(`${author}Section`)
    }
    else {
        row = document.querySelector(`#searchResults .row`)
    }
    const col = document.createElement('div')
    col.classList.add('col', 'my-4')

    const card = document.createElement('div')
    card.classList.add('card', "spotify-card", 'h-100')
    card.setAttribute('songID', song.id)


    const cardTop = document.createElement('div')
    cardTop.classList.add('position-relative', 'p-3', 'pb-0')
    card.appendChild(cardTop)

    const img = document.createElement('img')
    img.src = song.album.cover
    img.classList.add('card-img-top', 'album-img', 'shadow')
    img.alt = "Copertina Album"
    cardTop.appendChild(img)

    const playBtn = document.createElement('button')
    playBtn.classList.add('btn', 'play-btn', 'shadow-lg')
    playBtn.ariaLabel = "Play"
    cardTop.appendChild(playBtn)

    const playBtnIcon = document.createElement('i')
    playBtnIcon.classList.add('fa-solid', 'fa-play')
    playBtn.appendChild(playBtnIcon)


    const cardBottom = document.createElement('div')
    cardBottom.classList.add('card-body', 'd-flex', 'flex-column')
    card.appendChild(cardBottom)

    const title = document.createElement('h5')
    title.classList.add('card-title', 'text-truncate', 'text-white', 'mb-1')
    title.innerHTML = song.title
    cardBottom.appendChild(title)


    const innerBottom = document.createElement('div')
    innerBottom.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mt-auto', 'pt-2', 'text-secondary')
    cardBottom.appendChild(innerBottom)

    const innerBottomLeft = document.createElement('div')
    innerBottomLeft.classList.add('d-flex', 'align-items-center', 'artist-info', 'overflow-hidden')
    innerBottom.appendChild(innerBottomLeft)

    const profilePicture = document.createElement('img')
    profilePicture.src = song.artist.picture
    profilePicture.classList.add('rounded-circle', 'artist-img', 'me-2', 'shadow-sm')
    profilePicture.alt = song.artist.name
    innerBottomLeft.appendChild(profilePicture)

    const artist = document.createElement('span')
    artist.classList.add('text-truncate', 'artist-name')
    artist.innerHTML = song.artist.name
    innerBottomLeft.appendChild(artist)

    const duration = document.createElement('small')
    duration.classList.add('duration', 'ms-2', 'flex-shrink-0')
    duration.innerHTML = parseTime(song.duration)
    innerBottom.appendChild(duration)

    const addBtn = document.createElement('button')
    addBtn.classList.add('btn', 'btn-link', 'p-0', 'ms-2', 'add-to-library-btn')
    addBtn.ariaLabel = "Aggiungi alla libreria"
    addBtn.title = "Salva nella tua libreria"
    innerBottom.appendChild(addBtn)

    const addBtnIcon = document.createElement('i')
    addBtnIcon.classList.add('fa-solid', 'fa-plus')
    addBtn.appendChild(addBtnIcon)

    col.appendChild(card)
    row.appendChild(col)

    addBtnIcon.addEventListener('click',()=>{
        if(!saved.includes(song)){
            addBtnIcon.classList.remove('fa-plus')
            addBtnIcon.classList.add('fa-check')
            saved.push(song)
        }else{
            saved.splice(saved.indexOf(song), 1)
            addBtnIcon.classList.add('fa-plus')
            addBtnIcon.classList.remove('fa-check')
        }
        console.log(saved)
    })
}
const saved = []

//Function to convert time in seconds in min and sec
const parseTime = (duration) => {
    const mind = duration % (60 * 60)
    let minutes = Math.floor(mind / 60);

    let secd = mind % 60;
    let seconds = Math.ceil(secd);

    return `${minutes}:${seconds}`
}


const songContainers = document.querySelectorAll('.mainPage>.row:not(:first-child,:nth-child(2),:last-child)>div>div')

//Cycle on the existing author containers
songContainers.forEach(songContainer => {
    getAuthorSongs(songContainer.getAttribute('id'))
        .then(obj => {
            console.log(obj)
            obj.data.forEach(song => {
                createSongCard(song, songContainer.getAttribute('id'))
            })
        })
})

//Function to search the author
const search = () => {
    const input = document.getElementById('searchField')
    let visible = false

    if (input.value.length > 0) {
        showResults(input.value)
        visible = true
    } else {
        visible = false
    }

    changeVisibility('searchResults', visible)
    filter.forEach(el => {
        changeVisibility(el, !visible)
    })
}

//Function to clear previous researches
const clearResearch = () => {
    document.querySelector(`#searchResults .row`).innerHTML = ''
}

//Function to change visibility of a container
const changeVisibility = (id, boolean) => {
    if (boolean)
        document.getElementById(id).classList.remove("d-none")
    else
        document.getElementById(id).classList.add("d-none")
}

//Function to show the songs of the searched author
const showResults = (search) => {

    getAuthorSongs(search)
        .then(obj => {
            clearResearch()
            obj.data.forEach(song => {
                createSongCard(song, search)
            })
        })
}

const libraryBtn = document.querySelector('library-btn')
libraryBtn.addEventListener('click')