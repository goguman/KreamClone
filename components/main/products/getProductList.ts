import {useQuery} from "react-query";
import axios from "axios";


    const getProductList = async (theme) => {
        const {data} = await axios.get(
                `http://localhost:4000/getProductList?theme=${theme}`
        );
        return data;
    };

    export default (theme:string, key:number) => {
        const {status, data, error} =
            useQuery(theme+key, ()=>getProductList(theme));

        return {status, data, error};
    }