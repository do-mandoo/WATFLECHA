const $signUpBt = document.querySelector('.signUp-bt');
const $signUpForm = document.querySelector('.signUp-form');
const $signupName = document.querySelector('.signup-name');
const $signupId = document.querySelector('.signup-id');
const $signupPw = document.querySelector('.signup-pw');
const $signupRepw = document.querySelector('.signup-repw');
const $signUpContent = document.querySelectorAll('.signUp-content');

$signUpForm.onsubmit = async e => {
  let count = 0;

  e.preventDefault();

  // 에러메세지 초기화
  [...$signUpContent].forEach(signInput => {
    // 값을 올바르게 입력한후 다시 제출이벤트를 했을때 이전의 에러 메세지를 지워준다.
    signInput.nextElementSibling.textContent = '';

    // 값을 올바르게 입력한후 다시 제출이벤트를 했을때 이전의 에러 색깔을 지워준다.
    signInput.classList.remove('errorColor');
  });

  // 입력하려는 아이디와 서버에있는 아이디 비교
  const res = await fetch('/users');
  const users = await res.json();

  // 만약 값이 있으면 length가 양수, 없으면 0
  // 이미 아이디가 있을 경우
  // 경고 메세지를 올려준다.
  const checkDuplicationId = users.filter(user => user.id === $signupId.value).length;

  if (checkDuplicationId) {
    $signupId.classList.add('errorColor');
    $signupId.nextElementSibling.textContent = '아이디가 이미 존재합니다.'
    ++count;
  };

  // 인풋창이 빈값일경우 에러 메세지, 인풋창 색깔 변경
  [...$signUpContent].forEach(input => {
    if (input.value === '') {
      // 만약 input 뒤에 예전에 생성한 경고메세지가 남아있으면 지워준다.

      // 경고메세지를 생성해 그다음 요소로 넣어준다.
      input.classList.add('errorColor');
      input.nextElementSibling.textContent = `${input.id === 'name' ? '이름을 넣어주십시오.' : input.id === 'id' ? '아이디를 입력해 주십시오' : '비밀번호를 입력해 주십시오.'}`;
      ++count;
    }
  });

  // 비밀번호와 비빌번호 재입력을 비교해 같은지 비교한다.
  const comparePw = (Pwelement) => {
    Pwelement.classList.add('errorColor');

    Pwelement.nextElementSibling.textContent = '비밀번호가 서로 다릅니다.';
  };

  if ($signupPw.value !== $signupRepw.value) {
    comparePw($signupPw);
    comparePw($signupRepw);
    ++count;
  }

  // 에러가 있으면 count 개수를 늘려 만약 양수인경우 함수를 중단시킨다.
  if (count > 0) return;

  // 회원가입 아이디,비밀번호,이름이 서버에 저장이된다.
  const formData = new FormData($signUpForm);
  const signUp = {};

  for (const pair of formData) {
    signUp[pair[0]] = pair[1];
  }

  fetch('/users', {
    method:'POST',
    headers: { 'content-Type': 'application/json' },
    body: JSON.stringify(signUp)
  });

  // 회원가입이 원활이 된경우
  // 메인화면으로 넘어간다.
  location.href = '/';
};