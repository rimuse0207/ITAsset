import { combineReducers } from "redux";
import Now_Loader_Info_State from "./LoaderReducer/LoaderReducer";
import Login_Info_Reducer_State from "./LoginInfoReducer/LoginInfoReduce";

const rootReducer = combineReducers({
  Now_Loader_Info_State,
  Login_Info_Reducer_State,
});

export default rootReducer;
