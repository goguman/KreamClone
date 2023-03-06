import { useQuery } from 'react-query';
import axios from 'axios';


const payInfoQueryFunction = async (userId) => {
    const {data : result} = await axios.get(`http://localhost:4000/myPage/searchAccount`, { params : { userId : userId}})
    const { 0 : data } = result;
    return data;
}

export function useGetPay(user_id){
    const {status, data, error} =
        useQuery('accountInfo', ()=>payInfoQueryFunction(user_id));

    return {status, data, error};
}