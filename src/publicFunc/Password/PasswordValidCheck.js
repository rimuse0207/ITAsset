export const PasswordValidCheck = (password, passwordCheck) => {
  if (password.split("").length < 4) {
    return {
      passwordLength: true,
      passwordDifferent: false,
      specifyTextInclude: false,
    };
  } else if (password !== passwordCheck) {
    return {
      passwordLength: false,
      passwordDifferent: true,
      specifyTextInclude: false,
    };
  } else if (!isValidPassword(password)) {
    return {
      passwordLength: false,
      passwordDifferent: false,
      specifyTextInclude: true,
    };
  } else {
    return {
      passwordLength: false,
      passwordDifferent: false,
      specifyTextInclude: false,
    };
  }
};

function isValidPassword(password) {
  // 작은따옴표('), 백틱(`)이 포함되어 있으면 false 반환
  return !/['`{}]/.test(password);
}
