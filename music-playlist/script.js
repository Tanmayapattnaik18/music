document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const artistInput = document.getElementById('artist');
    const durationInput = document.getElementById('duration');
    const genreInput = document.getElementById('genre');
    const addSongButton = document.getElementById('add-song');
    const searchInput = document.getElementById('search');
    const genreFilter = document.getElementById('genre-filter');
    const sortButtons = {
        title: document.getElementById('sort-title'),
        artist: document.getElementById('sort-artist'),
        duration: document.getElementById('sort-duration'),
        genre: document.getElementById('sort-genre')
    };
    const playlistContainer = document.getElementById('playlist-container');

    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];

    const updatePlaylistContainer = (songs) => {
        playlistContainer.innerHTML = '';
        songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.classList.add('song-item');
            songItem.innerHTML = `
                <span>${song.title}</span>
                <span>${song.artist}</span>
                <span>${song.duration}</span>
                <span>${song.genre}</span>
                <button onclick="editSong(${index})">Edit</button>
                <button onclick="deleteSong(${index})">Delete</button>
            `;
            playlistContainer.appendChild(songItem);
        });
    };

    const savePlaylist = () => {
        localStorage.setItem('playlist', JSON.stringify(playlist));
    };

    const addSong = () => {
        const title = titleInput.value.trim();
        const artist = artistInput.value.trim();
        const duration = parseInt(durationInput.value.trim(), 10);
        const genre = genreInput.value.trim();

        if (title && artist && !isNaN(duration) && genre) {
            playlist.push({ title, artist, duration, genre });
            titleInput.value = '';
            artistInput.value = '';
            durationInput.value = '';
            genreInput.value = '';
            savePlaylist();
            updatePlaylistContainer(playlist);
            populateGenreFilter();
        }
    };

    const editSong = (index) => {
        const song = playlist[index];
        titleInput.value = song.title;
        artistInput.value = song.artist;
        durationInput.value = song.duration;
        genreInput.value = song.genre;
        addSongButton.innerText = 'Update Song';
        addSongButton.onclick = () => {
            song.title = titleInput.value.trim();
            song.artist = artistInput.value.trim();
            song.duration = parseInt(durationInput.value.trim(), 10);
            song.genre = genreInput.value.trim();
            savePlaylist();
            updatePlaylistContainer(playlist);
            populateGenreFilter();
            addSongButton.innerText = 'Add Song';
            addSongButton.onclick = addSong;
            titleInput.value = '';
            artistInput.value = '';
            durationInput.value = '';
            genreInput.value = '';
        };
    };

    const deleteSong = (index) => {
        playlist.splice(index, 1);
        savePlaylist();
        updatePlaylistContainer(playlist);
        populateGenreFilter();
    };

    const searchSongs = (e) => {
        const query = e.target.value.toLowerCase();
        const filteredSongs = playlist.filter(song =>
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
        );
        updatePlaylistContainer(filteredSongs);
    };

    const sortPlaylist = (key) => {
        playlist.sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        savePlaylist();
        updatePlaylistContainer(playlist);
    };

    const filterByGenre = () => {
        const selectedGenre = genreFilter.value;
        const filteredSongs = selectedGenre
            ? playlist.filter(song => song.genre === selectedGenre)
            : playlist;
        updatePlaylistContainer(filteredSongs);
    };

    const populateGenreFilter = () => {
        const genres = [...new Set(playlist.map(song => song.genre))];
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    };

    addSongButton.onclick = addSong;
    searchInput.oninput = searchSongs;
    genreFilter.onchange = filterByGenre;
    sortButtons.title.onclick = () => sortPlaylist('title');
    sortButtons.artist.onclick = () => sortPlaylist('artist');
    sortButtons.duration.onclick = () => sortPlaylist('duration');
    sortButtons.genre.onclick = () => sortPlaylist('genre');

    updatePlaylistContainer(playlist);
    populateGenreFilter();
});
