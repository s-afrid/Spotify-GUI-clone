let currentSong = new Audio();
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


const playMusic = (track) => {
    // let audio = new Audio("/songs/songs/"+track)
    currentSong.src = "/songs/songs/"+track
    audio.play()

}

async function main() {

    
    // get list of all the songs
    let songs = await getSongs()


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

    // play first song
    // var song = new Audio(songs[0]);
    // //song.play();

    // song.addEventListener("loadeddata",()=>{
    //     let duration = song.duration
    //     console.log(duration)
    // })
    
}   
 
main()
