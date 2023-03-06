import {useQuery} from "react-query";
import axios from "axios";

const getProductList = async (theme) => {
    const {data} = await axios.post(
        `http://localhost:4000/getProductList?theme=${theme}`
    )
    return data;
};

export default (theme:string) => {
    const {status, data, error} =
        useQuery(theme, ()=>getProductList(theme));

    return {status, data, error};
}