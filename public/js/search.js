const $searchBar2 = document.getElementById("search-bar2");
const $searchForm = document.querySelector(".search-form");
const $searchFormTop = document.querySelector(".search-form-top");
const $result = document.querySelector(".result");

// local storage
let user = JSON.parse(localStorage.getItem("login"));

// localstorage에 있는 이름을 화면에 렌더링
$main__name.innerHTML = user.name;

// 미 로그인 시 로그인 페이지로 이동
if (!JSON.parse(localStorage.getItem("login"))) {
  location.assign("/");
}

//event handler

// 스크롤 이벤트
$topBtn.onclick = () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

// 검색창 입력 시 영화 API로 검색 정보 가져오기
$searchForm.onsubmit = async (e) => {
  e.preventDefault();
  // console.log($searchForm.querySelector('input').value);
  $result__movies.innerHTML = "";
  render();
};

// 검색 API로 화면에 렌더하기
const render = async () => {
  try {
    const resMovie = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ko&query=${$searchBar2.value}&page=1&include_adult=false`
    );
    const { results } = await resMovie.json();
    // console.log(results);
    results.forEach((movie) => {
      const $li = document.createElement("li");
      $li.id = movie.id;
      const $a = document.createElement("a");
      $a.href = "#";
      $a.textContent = movie.title;
      const $img = document.createElement("img");
      if (movie.poster_path === null) {
        $img.src = "../image/준비중.png";
      } else {
        $img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      }
      $a.insertAdjacentElement("afterbegin", $img);
      $li.appendChild($a);
      $result__movies.appendChild($li);
    });
    $searchForm.querySelector("input").value = "";
  } catch (err) {
    console.log("[ERROR]", err);
  }
};
