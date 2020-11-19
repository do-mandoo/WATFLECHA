let getBookmarks;
const localUser = JSON.parse(localStorage.getItem('login'));

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
  } else {
    $likeBtn.firstElementChild.innerHTML = `찜하기`;
    $likeBtn.classList.remove("liked");
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

// open버튼 클릭 이벤트
$openBtn.onclick = () => {
  document.querySelector(".fa-chevron-down").classList.toggle("active");
  if ($popupOpen.clientHeight === 0) {
    $popupOpen.style.height = $popupOpen.scrollHeight + "px";
  } else {
    $popupOpen.style.height = 0;
  }
};

$result__movies.onclick = async (e) => {
  if (!e.target.matches("li *")) return;
  selectedId = e.target.parentNode.parentNode.id;
  $popup.style.display = "block";
  $overlay.style.display = "block";
  try {
    // 영화 API로 popup창 개별 정보 가져오기
    const resMovie = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}?api_key=${api_key}&language=ko`
    );
    const movie = await resMovie.json();
    
    // 배우 API
    const resActors = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}/credits?api_key=${api_key}&language=ko`
    );
    const mainActors = await resActors.json();
    const actors = mainActors.cast
      .slice(0, 4)
      .map((actor) => actor.name)
      .join(", ");
    popup(movie, actors);

    // 예고편 youtube API
    const resVideo = await fetch(
      `https://api.themoviedb.org/3/movie/${selectedId}/videos?api_key=${api_key}`
    );
    const { results } = await resVideo.json();
    if(results.length !== 0) {
    $popupVideo.innerHTML = `<iframe width="770" height="350" src="https://www.youtube.com/embed/${results[0].key}?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      $popupVideo.innerHTML = `<img src="../image/비디오준비중.jpg" width:720px >`;
    }
  } catch (err) {
    console.log("[ERROR]", err);
  }
};

// popup에서 하트 클릭시 toggle
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

// close버튼 클릭 이벤트
$closeBtn.onclick = async (e) => {
  $popupVideo.innerHTML = null;
  $popup.style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".fa-chevron-down").classList.remove("active");
  $popupOpen.style.height = 0;
  $likeBtn.firstElementChild.innerHTML = "찜완료!";
  modifyBookMarks();
};

// overlay 클릭 이벤트
$overlay.onclick = async () => {
  $popup.style.display = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".fa-chevron-down").classList.remove("active");
  $popupOpen.style.height = 0;
  modifyBookMarks();
};

// localstorage와 db에 반영된 북마크 연동하기
(async function () {
  const users = await fetch(`/users/${localUser.id}`);
  const { bookmarks } = await users.json();
  getBookmarks = bookmarks ? bookmarks : [];
})();