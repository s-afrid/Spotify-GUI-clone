let currentFolder;
let songs;
let currentSong = new Audio();
let play = document.getElementById("play");
let previous = document.getElementById("prev");
let next = document.getElementById("next");

async function getSongs(folder) {
  currentFolder = folder;
  /* This async function is used get songs from the link and stores them in a list */
  // Fetch the songs from folder, get response message. Store response text
  let a = await fetch(`${currentFolder}/`);
  let response = await a.text();
  // Create a div element and add the reponse html code inside it
  let div = document.createElement("div");
  div.innerHTML = response;
  // get all the anchor tags inside the div
  let as = div.getElementsByTagName("a");

  songs = []; // Array to store songs

  // get only those anchor tags in which the href value ends with ".mp3"
  for (i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${currentFolder}/`)[1]);
      // split return array of two strings split from one
      // split the string by a pivot ('/songs/songs/') and get its second part
    }
  }

  // Show all songs in the playlist
  let songlist = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songlist.innerHTML = "";
  for (const song of songs) {
    songlist.innerHTML =
      songlist.innerHTML +
      `<li><img class="invert" src="img/music.svg" alt="">
                  <div class="info">
                    <div><p>${song.replaceAll("%20", " ")}</p></div>
                    <div>Artists Name</div>
                  </div>
                  <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/playbutton2.svg" alt="">
                  </div></li>`;
  }

  // Attach an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(
        e.querySelector(".info").getElementsByTagName("div")[0].innerText
      );
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/songs/"+track)
  currentSong.src = `/${currentFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = `<p>${decodeURI(track).slice(
    0,
    decodeURI(track).length - 4
  )}</p>`;

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Ensure it's a number and not NaN
  seconds = Math.floor(seconds); // Remove decimals

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;

  // Add leading zeros if needed
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function displayAlbums() {
  let a = await fetch(`./songs/`);
  let response = await a.text();
  // Create a div element and add the reponse html code inside it
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcontainer = document.querySelector(".cardContainer");
  let array1 = Array.from(anchors);
  for (let index = 0; index < array1.length; index++) {
    const e = array1[index];
    if (e.href.includes("/songs") && !(e.href.includes(".htaccess"))) {
      let folder_name = e.href.split("/").slice(-2, -1)[0];
      if (folder_name != "songs") {
        // get meta data stored in json from folder
        let a = await fetch(
          `./songs/${folder_name}/info.json`
        );
        let response = await a.json();
        cardcontainer.innerHTML =
          cardcontainer.innerHTML +
          `<div data-folder="${folder_name}" class="card">
              <img class="play" src="img/playbutton.svg" alt="" width="30" height="30" />
              <img
                src="/songs/${folder_name}/cover.jpg"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
      }
    }
  }

  //Play the first song

  // load playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {

      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });

  
}

async function main() {
  // get list of all the songs
  await getSongs("./songs/cs");

  // play default song when clicked on play button
  playMusic(songs[0], true);

  // Display all albums
  displayAlbums();

  // Attach an event listener to previous, play and next

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/playbutton2.svg";
    }
  });

  // Listen for time update
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100 - 0.7
    }%`;
  });

  // Add event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let on_seek = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currentSong.currentTime = (on_seek / 100) * currentSong.duration;
    document.querySelector(".circle").style.left = `${on_seek}%`;
    // getBoundingClientRect() -  provide information about the size of an element and its position relative to the viewport.
  });

  // Click on hamburger to view left
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Click on close to close left
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add event listener to previous and next
  previous.addEventListener("click", () => {
    console.log("Previous");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    console.log("Next");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    }
  });

  // Event listener for mute
  let toggle2 = false;
  document.querySelector(".volume").addEventListener("dblclick", () => {
    toggle2 = !toggle2;
    if (toggle2) {
      document.querySelector(".volume").src = "img/mute.svg";
      currentSong.volume = 0;
      document.querySelector(".range").value = 0;
    }
  });


  // Event listener to volume button
  let toggle1 = false;
  document.querySelector(".volume").addEventListener("click", () => {
    toggle1 = !toggle1;
    if (toggle1) {
      document.querySelector(".volume").src = "img/volume2.svg";
      document.querySelector(".volumebar").style.visibility = "visible";
      
      }
     else {
      document.querySelector(".volume").src = "img/volume.svg";
      document.querySelector(".volumebar").style.visibility = "hidden";
      
    }
});

  
  // add an event to volume
  document.querySelector(".range").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  // play first song
  // var song = new Audio(songs[0]);
  // //song.play();

  // song.addEventListener("loadeddata",()=>{
  //     let duration = song.duration
  //     console.log(duration)
  // })
}

main();
