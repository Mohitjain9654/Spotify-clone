console.log("Let write some javascript");
let currentSong = new Audio();
let songs;
let currFolder;

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`https://mohitjain9654.github.io/Spotify-clone.github.io/${folder}/`);
  console.log("a: ", a);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
    if (element.href.endsWith(".mp4")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }

  //play the first song in the list

  //show all the songs in the list
  let songUL = document
    .querySelector(" .song_list")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";

  for (const song of songs) {
    const imagePath = `https://mohitjain9654.github.io/Spotify-clone.github.io/<span class="math-inline">\{folder\}/</span>{song.replaceAll(".mp3", ".jpeg").replaceAll(".mp4", ".jpeg")}`;
    songUL.innerHTML += `<li>

        <img src="<span class="math-inline">\{imagePath\}" onerror\="this\.src\='svg/music\.svg'" alt\=""\>
<div class\="info"\>
<div class\="songName"\></span>{song
            .replace("/", "")
            .replaceAll("%20", " ")
            .replaceAll(".mp3", "")
            .replaceAll(".mp4", "")
            .replaceAll("_", " ")}</div>
          <div class="songArtist">Song Artist</div>
        </div>
        <div class="playnow">
          <span>play now</span>
          <img id="playnow" src="svg/playnow.svg" class="invert" alt="">
        </div></li>`;
  }

  //attach event listeners to each song
  Array.from(
    document.querySelector(".song_list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(
        element
          .querySelector(".info")
          .firstElementChild.innerHTML.trim()
          .replaceAll(" ", "_") +
          "." +
          "mp3"
      );
    });
  });
  return songs;
}

const playMusic = (track) => {
  // let audio = new Audio("/Spotify/songs/" + track);
  currentSong.src = `/${currFolder}/` + track;
  currentSong.play();
  play.src = "svg/pause.svg";
  playnow.src = "svg/pausenow.svg";

  document.querySelector(".song_info").innerHTML = decodeURI(
    track
      .replaceAll("%20", " ")
      .replaceAll(".mp3", "")
      .replaceAll(".mp4", "")
      .replaceAll("_", " ")
      .replaceAll("/", "")
  );
  document.querySelector(".song_time").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  //fetch from diifrent folder
  let playlist = await fetch(`https://mohitjain9654.github.io/Spotify-clone.github.io/songs/`);
  let playlistResponse = await playlist.text();
  let playlistdiv = document.createElement("div");
  playlistdiv.innerHTML = playlistResponse;
  let playlistanchor = playlistdiv.getElementsByTagName("a");
  let playlistcard = document.querySelector(".header_bottom");
  let playlistArray = Array.from(playlistanchor);

  for (let index = 3; index < playlistArray.length; index++) {
    const element = playlistArray[index];

    if (element.href.includes("/songs/")) {
      let playlistfolder = element.href.split("/songs/").slice(-1)[0];
      let playlistjson = await fetch(
        `https://mohitjain9654.github.io/Spotify-clone.github.io/songs/${playlistfolder}/info.json`
      );
      let playlistResponsejson = await playlistjson.json();

      let a = await fetch(`https://mohitjain9654.github.io/Spotify-clone.github.io/songs/${playlistfolder}`);
      let responses = await a.text();
      let div = document.createElement("div");
      div.innerHTML = responses;
      let anchor = div.getElementsByTagName("a");

      let array = Array.from(anchor);
      let playcard = [];

      for (let index = 4; index < array.length; index++) {
        const b = array[index];

        if (b.href.includes("/songs")) {
          let folder = b.href.split("/songs/").slice(-1)[0];

          const baseUrl = "https://mohitjain9654.github.io/Spotify-clone.github.io/songs";
          if (folder.startsWith(baseUrl)) {
            console.warn(`Skipping invalid folder: '${folder}'`);
            continue; // Exit this function without proceeding
          }

          const json = "info.json";
          if (folder.endsWith(json)) {
            console.warn(`Skipping invalid folder: '${folder}'`);
            continue; // Exit this function without proceeding
          }

          let a = await fetch(
            `https://mohitjain9654.github.io/Spotify-clone.github.io/songs/${folder}/info.json`
          );

          let response = await a.json();

          // ... (rest of the folder validation and info.json fetching) ...

          playcard.push({
            folder,
            title: response.title,
            description: response.description,
          });
        }
      }

      // Create innercard with all songs
      let innercard = "";
      for (const song of playcard) {
        innercard += `
          <div data-folder="<span class="math-inline">\{song\.folder\}" class\="card rounded"\>
<div class\="play"\>
<img src\="svg/circle\_play\.svg" alt\=""\>
</div\>
<img class\="rounded" src\="songs/</span>{song.folder}/cover.jpeg" alt="">
            <h2><span class="math-inline">\{song\.title\}</h2\>
<p\></span>{song.description}</p>
          </div>
        `;
      }

      playlistcard.innerHTML += `<div class="spotifyPlaylists">
        <h1>${playlistResponsejson.title}</h1>
        <div class="cardContainer">
          <div class="cards">
            ${innercard} 
          </div>
        </div>
      </div>`;

      Array.from(document.getElementsByClassName("card")).forEach((e) => {
        // console.log(e);
        e.addEventListener("click", async (item) => {
          // console.log("fetching songs");
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(songs[0]);
        });
      });
    }
  }
}

async function main() {
  // Wait for the songs to be fetched
  await getSongs("songs/Spotify_Playlist/ncs");
  //   playMusic(songs[0], true);

  //display all the albums in the page
  displayAlbums();

  // attach event listener to play, next, previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svg/pause.svg";
      playnow.src = "svg/pausenow.svg";
    } else {
      currentSong.pause();
      play.src = "svg/play.svg";
      playnow.src = "svg/playnow.svg";
    }
  });

  //current time and duration
  currentSong.addEventListener("timeupdate", () => {
    let currentTime = Math.floor(currentSong.currentTime); // Current time in seconds
    let duration = Math.floor(currentSong.duration); // Total duration in seconds

    // Convert to minutes:seconds format
    let currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = currentTime % 60;

    let durationMinutes = Math.floor(duration / 60);
    let durationSeconds = duration % 60;
    currentMinutes =
      currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    durationMinutes =
      durationMinutes < 10 ? "0" + durationMinutes : durationMinutes;

    // Format seconds to always be two digits (e.g., 01, 02)
    currentSeconds =
      currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
    durationSeconds =
      durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;

    document.querySelector(
      ".song_time"
    ).innerHTML = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;

    // seekbar
    document.querySelector(".circle").style.width = `${
      (currentTime / duration) * 100
    }%`;
  });

  //add an event listener to the seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.width = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add event listener to Menu
  document.querySelector(".menu").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add event listener to close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
  });

  //add event listener to previous and next
  previous.addEventListener("click", () => {
    if (!songs || songs.length === 0) {
      console.error("Songs array is empty or undefined");
      return;
    }

    let currentSongName = currentSong.src.split("/").slice(-1)[0];
    let index = songs.findIndex((song) => song.includes(currentSongName));

    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      console.log("No previous song.");
    }
  });

  next.addEventListener("click", () => {
    if (!songs || songs.length === 0) {
      console.error("Songs array is empty or undefined");
      return;
    }

    let currentSongName = currentSong.src.split("/").slice(-1)[0];
    let index = songs.findIndex((song) => song.includes(currentSongName));
    console.log("Next: Current song name:", currentSongName, "Index:", index);

    if (index >= 0 && index < songs.length - 1) {
      playMusic(songs[index + 1]);
    } else {
      console.log("No next song.");
    }
  });

  //add event listener to volume up and dowm and in volume bar
  volume_up.addEventListener("click", () => {
    // Increase volume in small steps and ensure it does not exceed 1
    currentSong.volume = Math.min(1, currentSong.volume + 0.1);
    document.querySelector(".volume_circle").style.width =
      currentSong.volume * 100 + "%";
  });

  volume_down.addEventListener("click", () => {
    // Decrease volume in small steps and ensure it does not go below 0
    currentSong.volume = Math.max(0, currentSong.volume - 0.1);
    document.querySelector(".volume_circle").style.width =
      currentSong.volume * 100 + "%";
  });

  //volume bar
  document.querySelector(".volume_bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".volume_circle").style.width = percent + "%";
    currentSong.volume = percent / 100;
  });

  //load the playlist when ever the card it clicked
  //   songs = await getSongs("songs/ncs"); i have to update this line
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

main();
