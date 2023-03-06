import { useQuery } from 'react-query';
import axios from 'axios';



export default function searchAccount(userId) {
    const {status, data, error} = useQuery(
        ['getAccount', userId],
        () => axios.get(`http://localhost:4000/myPage/searchAccount?userId=${userId}`)
    );

    return {data, error};
}