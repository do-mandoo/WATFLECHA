const api_key = '173b78669a3a668e66151ca4a6a82176';

const $searchBar2 = document.getElementById('search-bar2');
const $searchForm = document.querySelector('.search-form');
const $result = document.querySelector('.result');

// local storage
localStorage.setItem('login', 
  JSON.stringify({
    id: 'Alex123', 
    name: 'Alex',
    genre: 'SF'
  }));
let user = JSON.parse(localStorage.getItem('login'));








$searchForm.onsubmit = async e => {
  e.preventDefault();
  console.log(e.target);
  console.log($searchForm.querySelector('input').value);
  // if (e.key !== 'Enter' || !e.target.value) return;
  try {
    // 영화 API로 popup창 개별 정보 가져오기

    // const external_id = 'tt12745164';
    const resMovie = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ko&query=${$searchBar2.value}&page=1&include_adult=false`);
    const movie = await resMovie.json();
    console.log(movie);
    // const render = (movieId) => {
    //   $result.innerHTML = `<div>${movie.movie_results[0].title}<div>`
    // } 
    // render(movie);
  } catch (err) {
    console.log('[ERROR]', err);
  };
}



// //event handler
// $search.onclick = () => {
//   if ($search.parentNode.parentNode.style.width !== '202px') {
//     $search.parentNode.parentNode.style.width = '202px'
//     const searchInput = $search.parentNode.nextElementSibling.firstElementChild;
//     searchInput.value = '';
//   } else {
//     $search.parentNode.parentNode.style.width = '20px';
//   }
// }

// // open버튼 클릭 이벤트
// $openBtn.onclick = () => {
//   document.querySelector('.fa-chevron-down').classList.toggle('active');
//   if($popupOpen.clientHeight === 0) {
//     $popupOpen.style.height = $popupOpen.scrollHeight + 'px';
//   } else {
//     $popupOpen.style.height = 0;
//   }
// }

// // close버튼 클릭 이벤트
// $closeBtn.onclick = async e => {
//   $popup.style.display = 'none';
//   document.querySelector('.overlay').style.display = 'none';
//   document.querySelector('.fa-chevron-down').classList.remove('active');
//   $popupOpen.style.height = 0;
//   // $likeBtn.classList.add('liked')
//   $likeBtn.firstElementChild.innerHTML = '찜완료!'
  
//   const res = await fetch(`/users/${user.id}`);
//   const {bookmarks : oldbookmarks} = await res.json();
  

//   // liked 유무에 따른 데이터 db에 반영
//   if (!$likeBtn.classList.contains('liked')){
//     try {
//       const removedNewBookmarks = oldbookmarks.filter(bookmark => bookmark !== selectedId);
//       await fetch(`/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'content-type': 'application/json'},
//         body: JSON.stringify({bookmarks: removedNewBookmarks})
//       })
//       $main__container__movies.removeChild(document.getElementById(selectedId));
//     } catch (err) {
//       console.log('[ERROR]', err);
//     };
//   } else {
//     try {
//       if(oldbookmarks.indexOf(selectedId) !== -1) return;
//       const addedNewBookmarks = oldbookmarks.concat(selectedId);
//       await fetch(`/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'content-type': 'application/json'},
//         body: JSON.stringify({bookmarks: addedNewBookmarks})
//       })
//     } catch (err) {
//       console.log('[ERROR]', err);
//     };
//   }
// }

// // overlay 클릭 이벤트
// $overlay.onclick = async () => {
//   $popup.style.display = 'none';
//   document.querySelector('.overlay').style.display = 'none';
//   document.querySelector('.fa-chevron-down').classList.remove('active');
//   $popupOpen.style.height = 0;

//   const res = await fetch(`/users/${user.id}`);
//   const {bookmarks : oldbookmarks} = await res.json();

//   // liked 유무에 따른 데이터 db에 반영
//   if (!$likeBtn.classList.contains('liked')){
//     try {
//       const removedNewBookmarks = oldbookmarks.filter(bookmark => bookmark !== selectedId);
//       await fetch(`/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'content-type': 'application/json'},
//         body: JSON.stringify({bookmarks: removedNewBookmarks})
//       })
//       $main__container__movies.removeChild(document.getElementById(selectedId));
//     } catch (err) {
//       console.log('[ERROR]', err);
//     };
//   } else {
//     try {
//       if(oldbookmarks.indexOf(selectedId) !== -1) return;
//       const addedNewBookmarks = oldbookmarks.concat(selectedId);
//       await fetch(`/users/${user.id}`, {
//         method: 'PATCH',
//         headers: { 'content-type': 'application/json'},
//         body: JSON.stringify({bookmarks: addedNewBookmarks})
//       })
//     } catch (err) {
//       console.log('[ERROR]', err);
//     };
//   }
// }

// // 스크롤 이벤트
// $topBtn.onclick = () => {
//   window.scroll({
//     top: 0,
//     left: 0,
//     behavior: 'smooth'
//   });
// }

// // popup에서 하트 클릭시 toggle
// $likeBtn.onclick = e => {
//   $likeBtn.classList.toggle('liked');
  
//   if ($likeBtn.classList.contains('liked')){
//     $likeBtn.firstElementChild.innerHTML = `찜완료!`;
//     $heartPopup.style.transition = 'all 0.1s';
//     $heartPopup.style.opacity = '1';
//     $heartPopup.style.zIndex = '300';
//     $heartPopup.style.display = 'block';
    
//     setTimeout(() => {
//       $heartPopup.style.opacity = '0';
//       $heartPopup.style.display = 'none';
//       $heartPopup.style.transition = 'none';
//       $heartPopup.style.zIndex = '-300';

//     }, 1000)();
//   } else {
//     $likeBtn.firstElementChild.innerHTML = '찜하기';
//   };
// }

// // 영화 클릭시 popup
// $main__container__movies.onclick = async e => {
//   if(!e.target.matches('.main__container__movies *')) return;
//   selectedId = e.target.parentNode.parentNode.id;
//   $popup.style.display = 'block';
//   $overlay.style.display = 'block';
//   $likeBtn.classList.add('liked');

//   try {
//     // 영화 API로 popup창 개별 정보 가져오기
//     const resMovie = await fetch(`https://api.themoviedb.org/3/movie/${e.target.parentNode.parentNode.id}?api_key=${api_key}&language=ko`);
//     // const {title, vote_average, overview, release_date, genres, runtime} = await resMovie.json();
//     const movie = await resMovie.json();
//     console.log(movie);

//     // 배우 API
//     const resActors = await fetch(`https://api.themoviedb.org/3/movie/${e.target.parentNode.parentNode.id}/credits?api_key=${api_key}&language=ko`)
//     const mainActors = await resActors.json();
//     const actors = mainActors.cast.slice(0,4).map(actor => actor.name).join(', ');
//     popup(movie, actors);

//     // 예고편 youtube API
//     const resVideo = await fetch(`https://api.themoviedb.org/3/movie/${e.target.parentNode.parentNode.id}/videos?api_key=${api_key}`);
//     const { results } = await resVideo.json();
//     $popupVideo.innerHTML = `<iframe width="770" height="350" src="https://www.youtube.com/embed/${results[0].key}?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;  
//   } catch (err) {
//     console.log('[ERROR]', err);
//   };
// }

// const popup = (movie, actors) => {
//   $popup__movieName.innerHTML = movie.title;
//   $vote.innerHTML = movie.vote_average !== 0 ? `${movie.vote_average} / 10` : '집계중';
//   $overview.innerHTML = movie.overview;
//   $releaseDate.innerHTML = movie.release_date;
//   $genre.innerHTML = movie.genres[0].name;
//   $runtime.innerHTML = movie.runtime;
//   $actors.innerHTML = actors;
// }

// const render = (userName, results) => {
//   $userName.innerHTML = userName;
//   console.log($main__container__movies.children.length);
//   const $li = document.createElement('li');
//   $li.id = results.id;
//   const $a = document.createElement('a');
//   $a.href = '#';
//   $a.textContent = results.title;
//   const $img = document.createElement('img');
//   $img.src = `https://image.tmdb.org/t/p/w500/${results.poster_path}`;
//   $a.insertAdjacentElement('afterbegin',$img);
//   $li.appendChild($a);
//   $main__container__movies.appendChild($li);
// }

// // <li class='${id}'>
// //   <a href="#">
// //     <img src=""></img>
// //     title
// //   </a>
// // </li>

// (async () => {
//   try {
//     const users = await fetch(`/users/${user.id}`);
//     const {name, bookmarks} = await users.json();    
//     bookmarks
//     .forEach(async movie_id => {
//       // 이 안에서 get 요청을 할 것
//       const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}&language=ko`;
//       const res = await fetch(url);
//       const results = await res.json();
//       // console.log(results);
//       // const userName = user.name;
//       render(name, results);
//     });
//   } catch (err) {
//     console.log('[ERROR]', err);
//   }
// })();