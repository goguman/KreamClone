import {useQuery} from "react-query";
import axios from "axios";

let param;

const getBankList = async () => {
    const {data} = await axios.get(
        `http://localhost:4000/myPage/sellAccount`
    );
    return data;
}

export async function searchAccount(values) {
    const {data} = await axios.post(
    'http://localhost:4000/myPage/searchAccount',{
     params : {userId : values}}
    );
    return data;
}

export default () => {

    const res = useQuery('banks', getBankList);

    const {status, data, error} = res;

    return {status, data, error};
}