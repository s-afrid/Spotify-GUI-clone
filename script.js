let currentSong = new Audio();
let play = document.getElementById("play")
async function getSongs(){
    /* This async function is used get songs from the link and stores them in a list */
    // Fetch the songs from folder, get response message. Store response text
    let a = await fetch("http://127.0.0.1:3000/songs/songs/")
    let response = await a.text()
    console.log(response);
    // Create a div element and add the reponse html code inside it
    let div = document.createElement("div")
    div.innerHTML = response;
    // get all the anchor tags inside the div
    let as = div.getElementsByTagName("a")
    console.log(as)
    
    let songs = [] // Array to store songs

    // get only those anchor tags in which the href value ends with ".mp3"
    for(i = 0; i < as.length; i++)
    {
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split('/songs/songs/')[1]) 
            // split return array of two strings split from one
            // split the string by a pivot ('/songs/songs/') and get its second part
        }
    }

    return songs
}


const playMusic = (track,pause=false) => {
    // let audio = new Audio("/songs/songs/"+track)
    currentSong.src = "/songs/songs/"+track
    
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).slice(0,decodeURI(track).length-4)

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

function formatTime(seconds) {
    // Ensure it's a number and not NaN
    seconds = Math.floor(seconds); // Remove decimals

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Add leading zeros if needed
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main() {

    
    // get list of all the songs
    let songs = await getSongs()
    // play default song when clicked on play button
    playMusic(songs[0],true)

    // Show all songs in the playlist
    let songlist = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songlist.innerHTML = songlist.innerHTML + `<li><img class="invert" src="music.svg" alt="">
                  <div class="info">
                    <div>${song.replaceAll("%20"," ")}</div>
                    <div>Artists Name</div>
                  </div>
                  <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="playbutton2.svg" alt="">
                  </div></li>`
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
            playMusic(e.querySelector(".info").getElementsByTagName("div")[0].innerHTML)
        })
        
    })

    // Attach an event listener to previous, play and next
   
    play.addEventListener("click", ()=>{
       
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "playbutton2.svg"
        }

    })
    

    // Listen for time update
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = `${(currentSong.currentTime/currentSong.duration)*100 - 0.7}%`;

    })

    // Add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let on_seek = (e.offsetX/e.target.getBoundingClientRect().width)*100
        console.log(on_seek);
        currentSong.currentTime = (on_seek/100)*currentSong.duration;
        document.querySelector(".circle").style.left = `${on_seek}%`;
        // getBoundingClientRect() -  provide information about the size of an element and its position relative to the viewport.
    }) 

    // Click on hamburger to view left
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    // Click on close to close left
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    // play first song
    // var song = new Audio(songs[0]);
    // //song.play();

    // song.addEventListener("loadeddata",()=>{
    //     let duration = song.duration
    //     console.log(duration)
    // })
    
}   
 
main()
