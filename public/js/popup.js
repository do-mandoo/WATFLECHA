const api_key = "00d9074f8fdaaf953fcbdf7b73aa351f";

const $main__container__movies = document.querySelector(".main");
const $popup = document.querySelector(".popup");
const $popupOpen = document.querySelector(".popup__open");
const $popupVideo = document.querySelector(".popup__video");
const $openBtn = document.querySelector(".open-btn");
const $closeBtn = document.querySelector(".close-btn");
const $likeBtn = document.querySelector(".like-btn");
const $popup__movieName = document.querySelector(".popup__movieName");
const $vote = document.querySelector(".vote");
const $overview = document.querySelector(".overview");
const $releaseDate = document.querySelector(".release-date");
const $genre = document.querySelector(".genre");
const $runtime = document.querySelector(".runtime");
const $actors = document.querySelector(".actors");
const $overlay = document.querySelector(".overlay");
const $heartPopup = document.querySelector(".heartPopup");
let selectedId;
let getBookmarks;

const popup = (movie, actors) => {
  if (selectedId) $popup__movieName.innerHTML = movie.title;
  $vote.innerHTML =
    movie.vote_average !== 0 ? `${movie.vote_average} / 10` : "집계중";
  $overview.innerHTML = movie.overview;
  $releaseDate.innerHTML = movie.release_date;
  $genre.innerHTML = movie.genres[0].name;
  $runtime.innerHTML = movie.runtime;
  $actors.innerHTML = actors;
  if (getBookmarks.indexOf(selectedId) !== -1) {
    $likeBtn.firstElementChild.innerHTML = `찜완료!`;
    $likeBtn.classList.add("liked");
  }
};

const modifyBookMarks = async () => {
  const patchBookmarks = $likeBtn.classList.contains("liked")
    ? getBookmarks
        .filter((movieId) => movieId !== selectedId)
        .concat(selectedId)
    : getBookmarks.filter((movieId) => movieId !== selectedId);
  try {
    const patchLi = await fetch(`/users/${localUser.id}`, {
      method: "PATCH",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        bookmarks: patchBookmarks,
      }),
    });
    const { bookmarks } = await patchLi.json();
    getBookmarks = bookmarks;
  } catch (err) {
    console.log("[ERROR]", err);
  }
  $likeBtn.classList.remove("liked");
  $likeBtn.firstElementChild.innerHTML = "찜하기";
};

$openBtn.onclick = () => {
  document.querySelector(".fa-chevron-down").classList.toggle("active");
  if ($popupOpen.clientHeight === 0) {
    $popupOpen.style.height = $popupOpen.scrollHeight + "px";
  } else {
    $popupOpen.style.height = 0;
  }
};

$main__container__movies.onclick = async (e) => {
  if (!e.target.matches("li *")) return;
  selectedId = e.target.parentNode.parentNode.id;
  $popup.style.display = "block";
  $overlay.style.display = "block";
  try {
    // 영화 API로 popup창 개별 정보 가져오기
    const resMovie = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}?api_key=${key}&language=ko`
    );
    const movie = await resMovie.json();

    const resActors = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}/credits?api_key=${key}&language=ko`
    );
    const mainActors = await resActors.json();
    const actors = mainActors.cast
      .slice(0, 4)
      .map((actor) => actor.name)
      .join(", ");

    popup(movie, actors);
    const resVideo = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}/videos?api_key=${key}`
    );
    const { results } = await resVideo.json();
    $popupVideo.innerHTML = `<iframe width="770" height="350" src="https://www.youtube.com/embed/${results[0].key}?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } catch (err) {
    console.log("[ERROR]", err);
  }
};

$likeBtn.onclick = async (e) => {
  $likeBtn.classList.toggle("liked");

  if ($likeBtn.classList.contains("liked")) {
    $likeBtn.firstElementChild.innerHTML = `찜완료!`;
    $heartPopup.style.transition = "all 0.1s";
    $heartPopup.style.opacity = "1";
    $heartPopup.style.zIndex = "300";
    $heartPopup.style.display = "block";

    setTimeout(() => {
      $heartPopup.style.opacity = "0";
      $heartPopup.style.display = "none";
      $heartPopup.style.transition = "none";
      $heartPopup.style.zIndex = "-300";
    }, 1000);
  } else {
    $likeBtn.firstElementChild.innerHTML = "찜하기";
  }
};

$closeBtn.onclick = async (e) => {
  $popupVideo.innerHTML = null;
  $popup.style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".fa-chevron-down").classList.remove("active");
  $popupOpen.style.height = 0;
  $likeBtn.firstElementChild.innerHTML = "찜완료!";
  modifyBookMarks();
};

$overlay.onclick = async () => {
  $popup.style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".fa-chevron-down").classList.remove("active");
  $popupOpen.style.height = 0;
  modifyBookMarks();
};

(async function () {
  const users = await fetch(`/users/${localUser.id}`);
  const { bookmarks } = await users.json();
  getBookmarks = bookmarks ? bookmarks : [];
})();
