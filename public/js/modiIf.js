// 로컬스토리지에 데이터를 쌓이게 해준다.
let user = JSON.parse(localStorage.getItem('login'));

// 만약 로그인이 되지 않은상태로 접근시 로그인페이지로 이동시킴
if(!user.curlog) {
  window.location.href = '/';
}

// 만약 로그인안한 상태로 페이지에 접근할 경우
// 로컬스토리지에 찾으려는 값이 없는경우 null이 반환된다.
// if(!localStorage.getItem('login')) window.location.href = '/';

const $modiIfBt = document.querySelector('.modiIf-bt');
const $modiIfName = document.querySelector('.modiIf-name');
const $modiIfId = document.querySelector('.modiIf-id');
const $modiIfPw = document.querySelector('.modiIf-pw');
const $modiIfRepw = document.querySelector('.modiIf-repw');
const $modiIfCurPw = document.querySelector('.modiIf-curPw');
const $modiIfContent = document.querySelectorAll('.modiIf-content');
const $pws = document.querySelectorAll('.pw');
const $preference = document.querySelector('.preference');
const $completedMessage = document.querySelector('.completedMessage');
const $modiBt = document.querySelectorAll('.modi-bt');
const $cancle = document.querySelector('.cancle');
const $message = document.querySelector('.message');

// 회원수정 페이지로 왔을때 input value 값 로그인되어있는 아이디 값으로 각각 초기화 해준다.
[...$modiIfContent].forEach(input => {
  let key = `${input.id === 'pw' || input.id === 'repw' ? '' : input.id}`

  input.value = `${user[key] ? user[key] : ''}`;
});

// 비밀번호 서로 다른지 확인
const comparePw = (Pwelement) => {
  Pwelement.classList.add('errorColor');
  Pwelement.nextElementSibling.textContent = '비밀번호가 서로 다릅니다.';
};

$modiIfBt.onclick = async e => {

  let errorCount = 0;
  let pwErrorCount = 0;

  // 에러메세지 초기화
  [...$modiIfContent].forEach(modiIfInput => {
    // 값을 올바르게 입력한후 다시 제출이벤트를 했을때 이전의 에러 메세지를 지워준다.
    modiIfInput.nextElementSibling.textContent = '';

    // 값을 올바르게 입력한후 다시 제출이벤트를 했을때 이전의 에러 색깔을 지워준다.
    modiIfInput.classList.remove('errorColor');
  });  

  // 기존의 이름과 동일한경우 에러메세지 넣어주기.
  // 이름 인풋창이 비어있거나, 기존 이름과 동일한 경우
  // 이름 인풋에서만 에러가 발생할 수 있게한다.

  // 장르를 수정해준다.
  const index = $preference.selectedIndex;

  // 현재 비밀번호가 비어있거나
  // 현재 비밀번호가 있을경우
  if ($modiIfCurPw.value === '') { //현재 비밀번호가 비어있는 경우
    if($preference.options[index].value) { // 장르 선택을 했다면 택한 값을 서버에 넣어준다.
      user.genre = $preference.options[index].value;
    } else if ($modiIfName.value === user.name) { // 기존의 이름과 동일한 경우
      $modiIfName.nextElementSibling.textContent = '기존의 이름과 동일합니다.';
      ++errorCount;
    } else if($modiIfName.value === '') { // 이름 인풋창이 비어있는 경우
      $modiIfName.nextElementSibling.textContent = '이름을 입력해주십시오.';
      ++errorCount;
    }
  } else { // 현재 비밀번호가 있는경우
    if($modiIfName.value === '') { // 이름 인풋창이 비어있는 경우
      $modiIfName.nextElementSibling.textContent = '이름을 입력해주십시오.';
      ++errorCount;
    }
  }

  // pw 인풋 태그들이 비어있는지 확인
  // 인풋창이 비어있지 않은 경우에만 배열에 할당
  const checkPwEmty = [...$pws].filter(pw => pw.value).length;

  // 만약 checkPwEmty이 0이면 인풋창에 아무것도 들어있지 않는다.
  // 양수인 경우에만 인풋창에 값이 들어가 있다.

  // 비어있지 않은 경우에만 비밀번호 에러메세지를 날려준다.
  if (checkPwEmty) {
    // 비밀번호와 비빌번호 재입력을 비교해 같은지 비교한다.
    if ($modiIfPw.value !== $modiIfRepw.value) {
      comparePw($modiIfPw);
      comparePw($modiIfRepw);
      $completedMessage.textContent = '';
      ++pwErrorCount;
    }

    // let user = JSON.parse(localStorage.getItem('login'));

    // 현재비밀번호 가져오기
    const curPwRes = await fetch(`/users/${user.id}`);
    const modiUser = await curPwRes.json();

    // 현재 비밀번호와 입력한 비밀번호가 같은지 확인한다.
    if ($modiIfCurPw.value !== modiUser.pw) {
      comparePw($modiIfCurPw);
      $modiIfCurPw.nextElementSibling.textContent = '현재 비밀번호와 입력한 비밀번호가 동일 하지않습니다.'
      ++pwErrorCount;
    } else if($modiIfPw.value === modiUser.pw && $modiIfRepw.value === modiUser.pw) { // 변경하려는 비밀번호가 기존의 비밀번호와 일치한지 비교
      $completedMessage.textContent = '기존의 비밀번호와 동일합니다.';
      ++pwErrorCount;
    }

    // 비밀번호 인풋창이 비어있는 경우
    [...$pws].forEach(pw => {
      if (pw.value === '') {
        // 경고메세지를 생성해 그다음 요소로 넣어준다.
        pw.classList.add('errorColor');
        pw.nextElementSibling.textContent = '비밀번호를 입력해주십시오.';
        ++pwErrorCount;
      }
    });

    // 비밀번호를 수정해준다.
    if (pwErrorCount > 0) return;

    const modiPwRes = await fetch(`/users/${user.id}`, {
      method:'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({pw : `${$modiIfPw.value}`})
    });
  
    //수정된 비밀번호를 서버에서 불러와서 pw input에 value값으로 넣어준다.
    const modiPwUser = await modiPwRes.json();
    $modiIfPw.value = modiPwUser.pw;
    $modiIfRepw.value = modiPwUser.pw;
  };
  
  // 에러가 있으면 count 개수를 늘려 만약 양수인경우 함수를 중단시킨다.
  if (errorCount > 0) return;

  // 로컬스토리지 수정
  localStorage.setItem('login',
  JSON.stringify({
    id: user.id,
    name: $modiIfName.value,
    genre: $preference.options[index].value ? $preference.options[index].value : user.genre, // 비어있으면 기존의 장르를 넣어준다, 비어있지 않으면 선택한 값을 넣어준다.
    savelog: user.saveLogin,
    curlog: user.curlog
  }));



  // localStorage.clear();

  // 이름 수정시켜준다.
  // fetch주소 로그인 id로 수정시켜주기
  const modiNameRes = await fetch(`/users/${user.id}`, {
      method:'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({name : `${$modiIfName.value}`})
  });

  if(index > 0) {
    const modiGenRes = await fetch(`/users/${user.id}`, {
      method:'PATCH', 
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({genre : `${$preference.options[index].value}`})
    });
  }

  //수정된 이름을 서버에서 불러와서 name input에 value값으로 넣어준다.
  const modiNameUser = await modiNameRes.json();
  $modiIfName.value = modiNameUser.name;
  
  console.log('Perfect');
  $completedMessage.textContent = '수정이 완료되었습니다.'
};

// 취소하기 버튼 클릭시 이전 페이지로 넘어간다.
$cancle.onclick = () => {
  window.history.go(-1);
};

[...$pws].forEach(pw => {
  pw.onfocus = () => {
    $message.classList.add('active');
  }
});