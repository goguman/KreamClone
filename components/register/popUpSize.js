import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {filedChange} from "../../store/slices/loginSlice";
import { useState,useRef,useEffect } from 'react';
import PopUpSize from './popUpSize';


const popUpSize = (props) => {
    const [sizeCheck, setSizeCheck] = useState(false);
    const [sizeConfirm, setSizeConfirm] = useState('');
    const sizeBoxRef = useRef([]);
    const [close, setClose] = useState(false);
    const closePop = useRef(null);
    const [sizeDiv, setSizeDiv] = useState('');
    const sizes = [
        {
            size : '220'
        },
        {
            size : '225'
        },
        {
            size : '230'
        },
        {
            size : '235'
        },
        {
            size : '240'
        },
        {
            size : '245'
        },
        {
            size : '250'
        },
        {
            size : '255'
        },
        {
            size : '260'
        },
        {
            size : '265'
        },
        {
            size : '270'
        },
        {
            size : '275'
        },
        {
            size : '280'
        },
        {
            size : '285'
        },
        {
            size : '290'
        },
        {
            size : '295'
        },
        {
            size : '300'
        }
    ];

    const onClickSize = (choice) =>{
        setSizeDiv(choice);
        setSizeConfirm(choice);
        if(sizeBoxRef.current[sizeDiv] !== undefined){
            sizeBoxRef.current[sizeDiv].style.fontWeight = "400";
            sizeBoxRef.current[sizeDiv].style.border = "1px solid #ebebeb";
        }
        sizeBoxRef.current[choice].style.fontWeight = "700";
        sizeBoxRef.current[choice].style.border = '1px solid black';
        if(sizeCheck === true && sizeBoxRef.current[props.size] !== undefined){
            sizeBoxRef.current[props.size].style.fontWeight = "400";
            sizeBoxRef.current[props.size].style.border = "1px solid #ebebeb";
        }
        setSizeCheck(true);
    }

    const setData = () => {
        if(props.size === '') {
            props.setSize(sizeConfirm);
        }else {
            if (sizeConfirm === '' && props.size !== '') {
                props.setSize(props.size);
                }
            if(sizeConfirm !== props.size && sizeConfirm !== ''){
                props.setSize(sizeConfirm);
                }
            }
        props.setOpenSize(false);
    }
    useEffect(() => {
        return () => {
            if (props.size !== '') {
                if(sizeBoxRef.current[props.size] !== null) {
                    sizeBoxRef.current[props.size].style.fontWeight = "700";
                    sizeBoxRef.current[props.size].style.border = '1px solid black';
                    setSizeCheck(true);
                }
            }
        }
    }, [props.size]);

    function handleClickOutside(event) {
        if(closePop.current && !closePop.current.contains(event.target)){
            props.setOpenSize(false);
        }else
            props.setOpenSize(true);
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [closePop]);

    return (
        <div className='bg-[#22222280] fixed w-screen z-50 inset-0'>
            <div className='top-1/2 fixed left-1/2 bg-white w-[448px] h-[428px] -translate-x-1/2 -translate-y-40 border rounded-2xl ' ref={closePop}>
                <div className='text-lg bg-white font-semibold pt-4 rounded-2xl h-[60px]'>
                    사이즈 선택
                </div>
                    <div className='flex w-full h-[270px] flex-wrap  overflow-y-scroll'>
                        {sizes.map((shoues, index) => (
                         <div className='w-1/3 h-[68px] p-2' key={index}>
                                <div className='border  h-full rounded-lg align-middle text-sm flex items-center justify-center'  ref={(sizeDiv) => {sizeBoxRef.current[shoues.size] = sizeDiv}}>
                                    <button className='pointer w-full h-full' onClick={()=>onClickSize(shoues.size)}>
                                        <div>{shoues.size}</div>
                                    </button>
                                </div>
                            </div>
                            ))}
                        </div>
                        <div>
                            {sizeCheck ?
                                (<button className='border w-28 h-10 rounded-xl text-sm mt-4 bg-black text-white pointer' onClick={setData}>확인</button>) :
                                (<button className='border w-28 h-10 rounded-xl text-sm mt-4 text-[#ebebeb] pointer-events-none'>확인</button>) }
                        </div>
                    </div>
            </div>
    )
}

export default popUpSize;