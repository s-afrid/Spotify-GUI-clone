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
            songs.push(element.href)
        }
    }

    return songs
}

async function main() {
    let songs = await getSongs()
    console.log(songs)
    // play the first song
    var song = new Audio(songs[0]);
    song.play();

    song.addEventListener("loadeddata",()=>{
        let duration = song.duration
        console.log(duration)
    })
    
}   
 
main()
