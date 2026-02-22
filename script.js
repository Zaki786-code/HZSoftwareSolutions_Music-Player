// Songs Data (Real Album Images Added)

const songs = [
    { 
        title:"Shape of You", 
        artist:"Ed Sheeran", 
        duration:"3:45", 
        src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
        image:"https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4"
    },
    { 
        title:"Blinding Lights", 
        artist:"The Weeknd", 
        duration:"4:12", 
        src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
        image:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
    },
    { 
        title:"Levitating", 
        artist:"Dua Lipa", 
        duration:"5:20", 
        src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", 
        image:"https://images.unsplash.com/photo-1506157786151-b8491531f063"
    },
    { 
        title:"Stay", 
        artist:"Justin Bieber", 
        duration:"3:58", 
        src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 
        image:"https://images.unsplash.com/photo-1485579149621-3123dd979885"
    },
    { 
        title:"Good 4 U", 
        artist:"Olivia Rodrigo", 
        duration:"4:35", 
        src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", 
        image:"https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2"
    }
];


// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const albumImage = document.getElementById('albumImage');
const albumArt = document.getElementById('albumArt');
const playlistContainer = document.getElementById('playlistContainer');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const autoplayToggle = document.getElementById('autoplayToggle');
const notification = document.getElementById('notification');


// Player State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffleOn = false;
let isRepeatOn = false;
let isAutoplayOn = false;


// Initialize Player
document.addEventListener("DOMContentLoaded", initPlayer);

function initPlayer(){
    loadSong(currentSongIndex);
    createPlaylist();
    setupEventListeners();
}


// Load Song
function loadSong(index){
    const song = songs[index];
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumImage.src = song.image;
    updatePlaylistActive(index);
}


// Create Playlist
function createPlaylist(){
    playlistContainer.innerHTML = '';

    songs.forEach((song,index)=>{
        const item = document.createElement('div');
        item.className = 'playlist-item';

        if(index === currentSongIndex) item.classList.add('active');

        item.innerHTML = `
            <div class="playlist-item-number">${index+1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;

        item.addEventListener('click',()=>{
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });

        playlistContainer.appendChild(item);
    });
}


// Update Active Song
function updatePlaylistActive(index){
    playlistContainer.querySelectorAll('.playlist-item')
        .forEach((item,i)=> item.classList.toggle('active', i===index));
}


// Play / Pause
function playSong(){
    audioPlayer.play();
    isPlaying = true;
    playPauseIcon.classList.replace('fa-play','fa-pause');
    albumArt.classList.add('playing');
    showNotification(`Playing: ${songs[currentSongIndex].title}`);
}

function pauseSong(){
    audioPlayer.pause();
    isPlaying = false;
    playPauseIcon.classList.replace('fa-pause','fa-play');
    albumArt.classList.remove('playing');
}

function togglePlayPause(){
    isPlaying ? pauseSong() : playSong();
}


// Next / Prev
function nextSong(){
    if(isShuffleOn){
        currentSongIndex = Math.floor(Math.random()*songs.length);
    } else {
        currentSongIndex = (currentSongIndex+1)%songs.length;
    }

    loadSong(currentSongIndex);
    playSong();
}

function prevSong(){
    currentSongIndex = (currentSongIndex-1+songs.length)%songs.length;
    loadSong(currentSongIndex);
    playSong();
}


// Progress
function formatTime(sec){
    const mins = Math.floor(sec/60);
    const seconds = Math.floor(sec%60).toString().padStart(2,'0');
    return `${mins}:${seconds}`;
}

function updateProgress(){
    if(audioPlayer.duration){
        const percent = (audioPlayer.currentTime/audioPlayer.duration)*100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
}

function setProgress(e){
    audioPlayer.currentTime = (e.offsetX/progressBar.clientWidth)*audioPlayer.duration;
}


// Volume
function setVolume(){
    audioPlayer.volume = volumeSlider.value/100;
    volumeValue.textContent = `${volumeSlider.value}%`;
}


// Notification
function showNotification(msg){
    notification.textContent = msg;
    notification.classList.add('show');
    setTimeout(()=>notification.classList.remove('show'),3000);
}


// Events
function setupEventListeners(){

    playPauseBtn.addEventListener('click',togglePlayPause);
    nextBtn.addEventListener('click',nextSong);
    prevBtn.addEventListener('click',prevSong);

    audioPlayer.addEventListener('timeupdate',updateProgress);
    progressBar.addEventListener('click',setProgress);

    volumeSlider.addEventListener('input',setVolume);
    audioPlayer.volume = 0.7;

    audioPlayer.addEventListener('ended',()=>{
        if(isRepeatOn){
            audioPlayer.currentTime = 0;
            playSong();
        } 
        else if(isAutoplayOn){
            nextSong();
        } 
        else{
            pauseSong();
        }
    });

    shuffleBtn.addEventListener('click',()=>{
        isShuffleOn = !isShuffleOn;
        shuffleBtn.classList.toggle('active');
        showNotification(isShuffleOn ? 'Shuffle On' : 'Shuffle Off');
    });

    repeatBtn.addEventListener('click',()=>{
        isRepeatOn = !isRepeatOn;
        repeatBtn.classList.toggle('active');
        showNotification(isRepeatOn ? 'Repeat On' : 'Repeat Off');
    });

    autoplayToggle.addEventListener('click',()=>{
        isAutoplayOn = !isAutoplayOn;
        autoplayToggle.classList.toggle('active');
        showNotification(isAutoplayOn ? 'Autoplay On' : 'Autoplay Off');
    });
}