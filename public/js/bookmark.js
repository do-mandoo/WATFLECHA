const $movies = document.querySelector('.main__container__movies');

const api_key = '173b78669a3a668e66151ca4a6a82176';
const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=en-US&page=1`;

const render = results => {
  $movies.innerHTML = results
    .map(({ poster_path, title }) => `
    <li>
    <a href="${url}">
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}">${title}
      </a>
    </li>`)
    .join('');
}

(async () => {
  try {
    const res = await fetch(url);
    // const news = await res.json()
    const {results} = await res.json()
    console.log(results);
    render(results);
  } catch (err) {
    console.log('[ERROR]', err);
  }
})();