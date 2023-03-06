import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQueryClient } from 'react-query';
import {useGetPay}  from '../../hooks/useGetPay';
import { useSession } from 'next-auth/react';

const cashReceipt =   () =>{
    const exList = [
        {
            key : "none",
            name : "미신청"
        },
        {
            key : "phone",
            name : "개인소득공제(휴대폰)"
        },
        {
            key : "card",
            name : "개인소득공제(현금연수증카드)"
        },

    ]
    const { data : session } = useSession();
    const {status ,data : userPayInfo} = useGetPay(session.userId);
    const [agree, setAgree] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [viewList, setViewList] = useState(false);
    const [choice, setChoice] = useState({
        key : 'none',
        name : '미신청',
        numbers : ''
    });
    function clickHandler(key,name) {
        setChoice(
            {
                key : key,
                name : name
            }
        );
        setViewList(false);
    }
    const onChangeHandler = (e) => {
            setChoice({
                ...choice,
                numbers: e.currentTarget.value.replace(/[^0-9]/g, '')
                });
    }
    function onClickHander(){
        if(choice.key === 'none'){
            axios.post(`http://localhost:4000/myPage/cashReceiptAdd`, {params : {user_id : session.userId, type : 'N', addNumber : ''}})
                .then((res)=>{
                    let timerInterval;
                    Swal.fire({
                        icon: 'success',
                        position: 'top',
                        background: '#222',
                        color: 'white',
                        width: '480px',
                        showConfirmButton: false,
                        text: '현금영수증 정보 저장 성공',
                        timer: 800,
                        timerProgressBar: true,
                        didOpen: () => {
                            timerInterval = setInterval(() => {
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    });
                }).catch((error)=> console.log(error));
        }else {
            axios.post(`http://localhost:4000/myPage/cashReceiptAdd`, {
                params: {
                    user_id: session.userId,
                    type: choice.key,
                    addNumber: choice.numbers
                }
            })
                .then((res) => {
                    let timerInterval;
                    Swal.fire({
                        icon: 'success',
                        position: 'top',
                        background: '#222',
                        color: 'white',
                        width: '480px',
                        showConfirmButton: false,
                        text: '현금영수증 정보 저장 성공',
                        timer: 800,
                        timerProgressBar: true,
                        didOpen: () => {
                            timerInterval = setInterval(() => {
                            }, 100)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    });
                }).catch((error) => console.log(error));
        }
    }

    useEffect(() => {
        if(userPayInfo !== undefined){
            if(userPayInfo.CASHTYPE === 'N') {
                setChoice({
                    key: 'none',
                    name: '미신청',
                    numbers: ''
                })
            }
            if(userPayInfo.CASHTYPE === 'phone'){
                setChoice({
                    key: 'phone',
                    name: '개인소득공제(휴대폰)',
                    numbers: userPayInfo.NUMBERS
                });
                setAgree(true);
            }
            if(userPayInfo.CASHTYPE === 'card'){
                setChoice({
                    key: 'card',
                    name: '개인소득공제(현금영수증카드)',
                    numbers: userPayInfo.NUMBERS
                });
                setAgree(true);
            }

        }
    },[userPayInfo]);

    return (
        <div>
            <div className='text-[24px] font-semibold'>
                현금영수증 정보
            </div>
            <p className='text-[13px] w-[480px]'>{"현금영수증은 판매 거래 시 발생하는 수수료에 대해 <정산완료> 후 7일 이내에 건별로 발견됩니다. '미신청'선택 시 자진 발급으로 처리됩니다."}</p>
            <div className='flex flex-col mt-2'>
                <p className='text-[14px]'>형태</p>
                <div className='w-[480px]  border-b-[1px] pb-2 flex mt-2 cursor-pointer' onClick={()=>{setViewList(!viewList)}}><input type='text'  autoComplete='off' readOnly className='text-[14px] font-[400] outline-none w-full cursor-pointer select-none' value={choice.name || ''} /><div className='ml-auto border-[1px] rounded-[50%] w-[24px] h-[24px] flex justify-center'><FontAwesomeIcon icon={faCaretDown} size='lg'/></div></div>
                {
                    viewList ?
                        <div>
                            <ul className='border w-[480px] text-[12px] font-[300] cursor-pointer z-20 absolute bg-white'>
                                { exList.map((data) => (
                                        <li className='pt-2 pl-2 pb-2' key={data.key} value={data.name} onClick={()=>clickHandler(data.key,data.name)}>{data.name}</li>
                                    ))}
                            </ul>
                        </div>
                        :
                        ''
                }
                {
                    choice.key === 'phone' ?
                        <div className='mb-4 w-[480px] mt-10 z-10'>
                            <h2 className='text-[14px]'>
                                휴대폰 번호
                            </h2>
                            <input className='text-[14px] mt-2 font-[200] w-full  border-b-[1px] pb-1 focus:login-focus' type='text' value={choice.numbers || ''} placeholder='- 없이 입력'  name='pNum' onChange={(e)=>onChangeHandler(e)}/>
                            <div className='mt-8'>
                            </div>
                        </div>
                        :
                        ''
                }
                {
                    choice.key === 'card' ?
                        <div className='mb-4 w-[480px] mt-10 z-10'>
                            <h2 className='text-[14px]'>
                                카드번호
                            </h2>
                            <input className='text-[14px] mt-2 font-[200] w-full  border-b-[1px] pb-1 focus:login-focus' type='text' value={choice.numbers || ''} placeholder='- 없이 입력'  name='cNum' onChange={(e)=>onChangeHandler(e)}/>
                            <div className='mt-8'>
                            </div>
                        </div>
                        :
                        ''
                }
                {choice.key !== 'none' &&
                    <div className='text-[12px] font-[300] flex items-center'>
                        <button className={`border w-[24px] h-[24px] mr-2 ${agree ? 'bg-black' : 'bg-white'} `} onClick={(e)=>{setAgree(!agree)}}></button>
                        현금영주증 신청 정보를 저장하여 자동으로 발급되는 것에 동의합니다.</div>
                }
                <div className='flex justify-center w-[480px] text-[14px]'><button className={`border-[1px] text-white py-2 px-8 rounded-xl mt-8 ${agree && choice.numbers !== '' || choice.key === 'none' ? 'bg-black' : 'bg-gray-200'}`} onClick={onClickHander}>저장하기</button></div>
            </div>
        </div>

    )
}

export default cashReceipt;