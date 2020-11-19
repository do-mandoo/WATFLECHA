const api_key = '173b78669a3a668e66151ca4a6a82176';

const $searchBar2 = document.getElementById('search-bar2');
const $searchForm = document.querySelector('.search-form');
const $searchFormTop = document.querySelector('.search-form-top');
const $result = document.querySelector('.result');

const $main__name = document.querySelector('.main__name');
const $popup = document.querySelector('.popup');
const $popupOpen = document.querySelector('.popup__open');
const $openBtn = document.querySelector('.open-btn');
const $closeBtn = document.querySelector('.close-btn');
const $likeBtn = document.querySelector('.like-btn');
const $topBtn = document.querySelector('.top-btn');
const $popupVideo = document.querySelector('.popup__video');
const $result__movies = document.querySelector('.result__movies');
const $popup__movieName = document.querySelector('.popup__movieName');
const $vote = document.querySelector('.vote');
const $overview = document.querySelector('.overview');
const $releaseDate = document.querySelector('.release-date');
const $genre = document.querySelector('.genre');
const $actors = document.querySelector('.actors');
const $runtime = document.querySelector('.runtime');
const $overlay = document.querySelector('.overlay');
const $search = document.querySelector('.search-btn-top');
const $header__logo = document.querySelector('.header__logo');
const $heartPopup = document.querySelector('.heartPopup');
let selectedId;

// local storage => 최종때 꼭 지워주세요!!!!!!!!!!!!!!!!!!
localStorage.setItem('login', 
JSON.stringify({
  id: 'Alex123', 
  name: 'Alex',
  genre: 'SF'
}));
let user = JSON.parse(localStorage.getItem('login'));

// localstorage에 있는 이름을 화면에 렌더링
$main__name.innerHTML = user.name;

// 미 로그인 시 로그인 페이지로 이동
if (!JSON.parse(localStorage.getItem("login"))) {
  location.assign('/');
};

//event handler
// close버튼 클릭 이벤트
$closeBtn.onclick = async e => {
  $popup.style.display = 'none';
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.fa-chevron-down').classList.remove('active');
  $popupOpen.style.height = 0;
  
  const res = await fetch(`/users/${user.id}`);
  const {bookmarks : oldbookmarks} = await res.json();
  

  // liked 유무에 따른 데이터 db에 반영
  if (!$likeBtn.classList.contains('liked')){
    try {
      const removedNewBookmarks = oldbookmarks.filter(bookmark => bookmark !== selectedId);
      await fetch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({bookmarks: removedNewBookmarks})
      })
      $result__movies.removeChild(document.getElementById(selectedId));
    } catch (err) {
      console.log('[ERROR]', err);
    };
  } else {
    try {
      if(oldbookmarks.indexOf(selectedId) !== -1) return;
      const addedNewBookmarks = oldbookmarks.concat(selectedId);
      await fetch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({bookmarks: addedNewBookmarks})
      })
    } catch (err) {
      console.log('[ERROR]', err);
    };
  }
}

// overlay 클릭 이벤트
$overlay.onclick = async () => {
  $popup.style.display = 'none';
  document.querySelector('.overlay').style.display = 'none';
  document.querySelector('.fa-chevron-down').classList.remove('active');
  $popupOpen.style.height = 0;

  const res = await fetch(`/users/${user.id}`);
  const {bookmarks : oldbookmarks} = await res.json();

  // liked 유무에 따른 데이터 db에 반영
  if (!$likeBtn.classList.contains('liked')){
    try {
      const removedNewBookmarks = oldbookmarks.filter(bookmark => bookmark !== selectedId);
      await fetch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({bookmarks: removedNewBookmarks})
      })
      $main__container__movies.removeChild(document.getElementById(selectedId));
    } catch (err) {
      console.log('[ERROR]', err);
    };
  } else {
    try {
      if(oldbookmarks.indexOf(selectedId) !== -1) return;
      const addedNewBookmarks = oldbookmarks.concat(selectedId);
      await fetch(`/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({bookmarks: addedNewBookmarks})
      })
    } catch (err) {
      console.log('[ERROR]', err);
    };
  }
}

// 스크롤 이벤트
$topBtn.onclick = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

// window.onscroll = e => {
//   let yOffset = window.pageYOffset;
//   if (yOffset !== 0) {
//     $topBtn.style.display = 'block';
//   } else if ( yOffset === 0) {
//     $topBtn.style.display = 'none';
//   }
// }

// 검색창 입력 시 영화 API로 검색 정보 가져오기
$searchForm.onsubmit = async e => {
  e.preventDefault();
  // console.log($searchForm.querySelector('input').value);
  $result__movies.innerHTML = '';
  render();
}

// 검색 API로 화면에 렌더하기
const render = async () => {
  try {
    const resMovie = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ko&query=${$searchBar2.value}&page=1&include_adult=false`);
    const {results} = await resMovie.json();
    // console.log(results);
    results
    .forEach(movie => {
    const $li = document.createElement('li');
    $li.id = movie.id;
    const $a = document.createElement('a');
    $a.href = '#';
    $a.textContent = movie.title;
    const $img = document.createElement('img');
    if (movie.poster_path === null) {
      $img.src = '../image/준비중.png';
    } else {
    $img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    }
    $a.insertAdjacentElement('afterbegin',$img);
    $li.appendChild($a);
    $result__movies.appendChild($li);  
    });
    $searchForm.querySelector('input').value = '';
  } catch (err) {
    console.log('[ERROR]', err);
  };
}