let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    // currFolder = folder;
    // let a = await fetch(`/${folder}/`)
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    //     })
    // })
    return songs
}

const playMusic=(track, pause=false)=>{
    currentSong.src = `/songs/` + track
    if(!pause){
        currentSong.play()
        play.src= "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){
    let songs= await getSongs()
    console.log(songs)
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ `<li>
        <img src="img/logo.svg" alt="">
        <div class="info">
            ${song.replaceAll("%20"," ")}
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="img/play.svg" alt="">
        </div>
    </li>`
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").innerHTML.trim())
        })
    })

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src= "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src= "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime*100)/currentSong.duration + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        console.log(currentSong.currentTime)
    })
}
main()
