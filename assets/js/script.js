
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

    card.innerHTML = `
        <div class="position-relative p-3 pb-0">
            <img src="${song.album.cover}" class="card-img-top album-img shadow"
                alt="Copertina Album">
            <button class="btn play-btn shadow-lg" aria-label="Play">
                <i class="fa-solid fa-play"></i>
            </button>
        </div>

        <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate text-white mb-1">${song.title}</h5>

            <div class="d-flex justify-content-between align-items-center mt-auto pt-2 text-secondary">
                <div class="d-flex align-items-center artist-info overflow-hidden">
                    <img src="${song.artist.picture}"
                        // class="rounded-circle artist-img me-2 shadow-sm" alt="${song.artist.name}">
                    <span class="text-truncate artist-name">${song.artist.name}</span>
                </div>
                <small class="duration ms-2 flex-shrink-0">${parseTime(song.duration)}</small>
            </div>
    `

    col.appendChild(card)
    row.appendChild(col)
}

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
