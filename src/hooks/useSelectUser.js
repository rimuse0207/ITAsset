import { useEffect, useState } from "react";
import { Request_Get_Axios } from "../API";

const useSelectUser = () => {
  const [selectUserOption, setSelectUserOption] = useState([]);
  useEffect(() => {
    getUserOptions();
  }, []);

  const getUserOptions = async () => {
    const result = await Request_Get_Axios("/Asset/User");

    if (result.status) setSelectUserOption(result.data);
  };
  return { selectUserOption };
};

export default useSelectUser;
