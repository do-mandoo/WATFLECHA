const key = "00d9074f8fdaaf953fcbdf7b73aa351f";
const lang = "ko";
const imgBase = "https://image.tmdb.org/t/p/w500/";
const $movieLists = document.querySelectorAll(".main section");
const liWidth = document.querySelector("section").scrollWidth / 5;
const $genreList = document.querySelector(".genre-list");

let onMoving = false;
let genreList = [];

// $genreList.onclick = (e) => {
//   if (!e.target.matches("ul>*")) return;
//   // window.location.href("http://localhost:3000/html/genre.html");
//   const search = [...$genreList].filter(list.name => e.target.firstElementChild.)
//   console.log(e.target);
// };

const makeLi = (movie, ul, num) => {
  const $li = document.createElement("li");
  const $a = document.createElement("a");
  const $img = document.createElement("img");
  $li.id = movie.id;
  $a.hret = "#";
  $img.src = `${imgBase}${movie.backdrop_path}`;
  $a.textContent = movie.title;
  $a.insertAdjacentElement("afterbegin", $img);
  if (ul.classList.contains("top10-list")) {
    const $span = document.createElement("span");
    $span.textContent = num;
    $li.appendChild($span);
  }
  $li.appendChild($a);
  ul.appendChild($li);
  $li.style.width = `${liWidth}px`;
};
// 슬라이드
const cloneLi = (ul) => {
  const arr = [];
  for (let i = 0; i < 4; i++) {
    const $first = ul.querySelector(`li:nth-child(${i + 1})`).cloneNode(true);
    const $last = ul
      .querySelector(`li:nth-child(${ul.querySelectorAll("li").length - i})`)
      .cloneNode(true);
    arr.push($first, $last);
  }
  for (let i = 0; i < arr.length; i++) {
    if (i % 2) {
      ul.insertBefore(arr[i], ul.firstElementChild);
    } else {
      ul.appendChild(arr[i]);
    }
  }
};

const getMovieList = async (getValue, $ul) => {
  const url =
    getValue === "favorite"
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=14&language=${lang}`
      : `https://api.themoviedb.org/3/movie/${getValue}?api_key=${key}&language=${lang}&page=1`;
  const res = await fetch(url);
  const { results: movies } = await res.json();
  await movies.forEach((movie, i) => {
    makeLi(movie, $ul, i + 1);
    if (i === movies.length - 1) cloneLi($ul);
  });
  $ul.style.width = `${(movies.length + 8) * liWidth}px`;
};
// 슬라이드
const clickBtn = ($button, $ul) => {
  if (onMoving) return;
  onMoving = true;
  $ul.style.transition = "all 0.5s";

  const start = $ul.style.transform.indexOf("(") + 1;
  const end = $ul.style.transform.indexOf("p");
  const ulWidth = +$ul.style.width.slice(0, -2);
  const divWidth = +$ul.parentNode.parentNode.offsetWidth;
  const maxMove = divWidth - ulWidth;
  let moveValue = +$ul.style.transform.substring(start, end);
  const movingValue = liWidth * 2;

  if ($button.classList.contains("prev")) {
    moveValue =
      moveValue + movingValue <= -movingValue
        ? moveValue + movingValue
        : -movingValue;
    if (moveValue >= -movingValue) {
      $ul.style.transform = `translateX(${moveValue}px)`;
      setTimeout(() => {
        $ul.style.transform = `translateX(${-movingValue * 11}px)`;
        $ul.style.transition = "none";
        onMoving = false;
      }, 500);
    } else {
      $ul.style.transform = `translateX(${moveValue}px)`;
    }
  } else {
    moveValue =
      moveValue - movingValue >= maxMove ? moveValue - movingValue : maxMove;
    if (moveValue <= -movingValue * 11) {
      $ul.style.transform = `translateX(${moveValue}px)`;
      setTimeout(() => {
        $ul.style.transform = `translateX(${-liWidth * 2}px)`;
        $ul.style.transition = "none";
        onMoving = false;
      }, 500);
    } else {
      $ul.style.transform = `translateX(${moveValue}px)`;
    }
  }
  $ul.ontransitionend = () => {
    onMoving = false;
  };
};

[...$movieLists].forEach(($list) => {
  getMovieList($list.id, $list.querySelector("ul"));
});

[...$movieLists].forEach(($section) => {
  $section.querySelector("ul").style.transform = `translateX(${-(
    4 * liWidth
  )}px)`;
  $section.onclick = (e) => {
    const $ul = e.target.parentNode.querySelector("ul");
    if (e.target.matches("button")) clickBtn(e.target, $ul);
  };
});

(async function () {
  const genreRes = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}&language=ko`
  );
  const { genres } = await genreRes.json();
  genreList = genres;
  console.log(genreList);
})();

(async function () {
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/movie/531219/videos?api_key=${key}`
  );
  const { results } = await videoRes.json();
  document.querySelector(
    ".video-container"
  ).innerHTML = `<iframe src="https://www.youtube.com/embed/${results[0].key}?autoplay=1&mute=1&controls=0&rel=0&loop=1&playlist=${results[0].key}" 
  frameborder="0" style="width: 100vw; height: 100%;"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
})();

// fetch(
//   `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=${lang}&page=1`
// )
//   .then((res) => res.json())
//   .then(({ results }) => {
//     $topList.style.width = `${results.length * 200}px`;
//   });

// fetch(
//   `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=${lang}&page=1`
// )
//   .then((res) => res.json())
//   .then(({ results }) => {
//     $newList.style.width = `${results.length * 200}px`;
//     results.forEach((movie) => {
//       makeLi(movie, $newList);
//     });
//   });

// fetch(`https://api.themoviedb.org/3/movie/531219/videos?api_key=${key}`)
//   .then((res) => res.json())
//   .then(({ results }) => {
//     document.querySelector(
//       ".video-container"
//     ).innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${results[0].key}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
//   });
// '<iframe width="560" height="315" src="https://www.youtube.com/embed/9nlhmJF5FNI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
// `<iframe width="450" height="450" src="https://www.youtube.com/embed/${results[0].key}?autoplay=1" frameborder="0" allow="autoplay" picture-in-picture" allowfullscreen></iframe>`;
// fetch(
//   `https://api.themoviedb.org/3/movie/644479/credits?api_key=${key}&language=en-US`
// )
//   .then((res) => res.json())
//   .then((result) => {
//     console.log(result);
//   });
//https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=<<api_key>>&language=en-US
