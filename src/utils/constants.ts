export const REGEX_NUMERIC = new RegExp(/[^0-9]/g);

export const PASSWORD_MAXLENGTH = 20;

export const PASSWORD_POLICY = {
    minLength: 8,
    upperCase: {
      length: 1,
    },
    lowerCase: {
      length: 3,
    },
    specialCharacter: {
      length: 1,
      characters: "!@#$%^&*()",
    },
    digit: {
      length: 2,
    },
  };

export const UserSupportmaxLength = 250 ;

export const PERMISSIONS =  [
  "LIST",
  "CREATE",
  "UPDATE",
  "DELETE",
]
