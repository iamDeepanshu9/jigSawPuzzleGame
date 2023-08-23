export interface UserLoginRequestBody{
  username: string;
  password: string;
}

export interface UserLoginResponseData{
  userId: number;
  username: string;
  email:string;
  userScores: UserScores
}

export interface UserScores{
  id: number
  userID:number
  date: string,
  score: number
}

export interface SignUpRequestBody{
  email: string;
  password: string;
  username: string;
}
