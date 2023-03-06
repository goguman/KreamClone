import {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Post from './post';
import DaumPostCode from 'react-daum-postcode';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useQueryClient } from 'react-query';

const addAddress = (props)  => {
    const [submitConfirm, setSubmitConfirm] = useState(true);
    const [name, setName] = useState();
    const {data : session } = useSession();
    const [phone, setPhone] = useState();
    const nameFocus = useRef('');
    const submitBtn = useRef('');
    const [popUp, setPopUp] = useState(false);
    const [detail, setDetail] = useState();
    const [check, setCheck] = useState(false);
    const queryClient = useQueryClient();
    const focusDetail = useRef('');
    const closePop = useRef(null);
    const [address, setAddress] = useState({
            address1 : '',
            postCode : ''
        });


    useLayoutEffect(() => {
        if (nameFocus.current !== null) nameFocus.current.focus();
        if(props.editAddr !== undefined && props.editAddr.DEFAULT_YN === 'Y') setCheck(true);
        console.log(props.editAddr);
    },[]);

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name] : e.target.value
        });
    }

    const onPost = (data) => {
        setPopUp(!popUp);
    }
    const onCheck = (e) => {
        setCheck(!check);
    }
    const onClosePop = () => {
        props.setOpenAddress(false);
    }
    const onChangeHandler = (e) => {
        if(e.currentTarget.name === 'userName'){
            setName(e.currentTarget.value);
        }
        if(e.currentTarget.name === 'phoneNumber'){
            setPhone(e.currentTarget.value.replace(/[^0-9]/g, ''));
        }
        if(e.currentTarget.name === 'detail'){
            setDetail(e.currentTarget.value);
        }
    }

    function handleClickOutside(event) {
        if(closePop.current && !closePop.current.contains(event.target)){
            props.setOpenAddress(false);
        }else
            props.setOpenAddress(true);
    }

    function onClickHandler(event) {
        if(event.target.name === 'cancel'){
            props.setOpenAddress(false);
        }
        if(event.target.name === 'submit') {
            let default_address = 'N';
            if (check) default_address = 'Y';
            if (props.editAddr !== undefined && props.editAddr.ADDRESS_ID) {
                axios.post(`http://localhost:4000/myPage/editAddress`, {
                    params: {
                        user_id: session.userId,
                        name: name,
                        phone: phone,
                        address1: address.address1,
                        postCode: address.postCode,
                        detail: detail,
                        check: default_address,
                        address_id: props.editAddr.ADDRESS_ID
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
                            fonstSize: '14px',
                            showConfirmButton: false,
                            text: '주소 변경 성공',
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
                        queryClient.invalidateQueries({queryKey: ['addressList'], refetchActive: true})
                        props.setOpenAddress(false);
                    })
                    .catch((error) => console.log(error));
            } else {
                axios.post(`http://localhost:4000/myPage/addAddress`, {
                    params: {
                        user_id: session.userId,
                        name: name,
                        phone: phone,
                        address1: address.address1,
                        postCode: address.postCode,
                        detail: detail,
                        check: default_address
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
                            fonstSize: '14px',
                            showConfirmButton: false,
                            text: '주소 저장 성공',
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
                        queryClient.invalidateQueries({queryKey: ['addressList'], refetchActive: true})
                        props.setOpenAddress(false);
                    })
                    .catch((error) => console.log(error));
            }
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [closePop]);
    useEffect(() => {
        if(props.editAddr) {
            setAddress({
                address1: props.editAddr.ADDRESS1,
                postCode: props.editAddr.POSTCODE
            })
            setDetail(props.editAddr.ADDRESS2);
        }
    }, []);
    useEffect(() => {
        if(!popUp && detail === '') focusDetail.current.focus();
    }, [popUp,detail]);
    useEffect(() => {
        if(name !== undefined && phone !== undefined && name.length >= 1 && phone.length >= 10 && address ){
            setSubmitConfirm(false);
        }
    }, [name, phone]);

    return (
        <div className='bg-[#22222280] fixed w-screen z-50 inset-0'>
            <div className='bg-white w-[520px] border border-black rounded-lg px-8 py-4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]' ref={closePop}>
                <div className='flex'>
                       <div className='flex w-full justify-center font-[600] text-[18px]'>새 주소 추가</div> <a className='ml-auto cursor-pointer' onClick={onClosePop}><FontAwesomeIcon icon={faXmark}/></a>
                </div>
                <div className={`my-4 ${name !== undefined && name.length<=1 ? 'text-[red]' : ''}`}>
                    <h2 className='text-[14px]'>
                        이름
                    </h2>
                    <input className={`text-[14px] font-[200] w-full  border-b-[1px] pb-1 ${name !== undefined  && name.length <= 1 ? 'outline-none border-b-[red]' : 'focus:login-focus'}`} placeholder='수령인의 이름' type='text' onChange={onChangeHandler} name='userName' autoComplete='off' ref={nameFocus}/>
                    {name !== undefined && name.length <=1 ? <span className='text-[10px] text-[red]'>올바른 이름을 입력해주세요. (2 - 50자)</span> : ''}
                </div>
                <div className={`mb-4 ${phone !== undefined && phone.length<=10 ? 'text-[red]' : ''}`}>
                    <h2 className='text-[14px]'>
                        휴대폰 번호
                    </h2>
                    <input className={`text-[14px] font-[200] w-full  border-b-[1px] pb-1 ${phone !== undefined  && phone.length <= 9 ? 'outline-none border-b-[red]' : 'focus:login-focus'}`} type='text' value={phone || ''} placeholder='- 없이 입력' onChange={onChangeHandler} name='phoneNumber'/>
                    {phone !== undefined && phone.length <=10 ? <span className='text-[10px] text-[red]'>정확한 휴대폰 번호를 입력해주세요.</span> : ''}
                </div>
                <div className='border-b-[1px] mb-4'>
                    <h2 className='text-[14px]'>
                        우편번호
                    </h2>
                    <div className='flex'>
                        <input className='my-2 text-[15px] font-[200] outline-none' placeholder='우편 번호를 검색하세요' onChange={handleChange} name='postCode' value={address.postCode || ''} readOnly={true}/>
                        <button className='border ml-auto mb-2 px-4 py-2 text-[12px] font-[200] rounded-xl' onClick={onPost}>우편번호</button>
                    </div>
                </div>
                {popUp && (<Post setPopUp={setPopUp} setAddress={setAddress} address={address} setDetail={setDetail}/>)}
                <div className='border-b-[1px] mb-4'>
                    <h2 className='text-[14px]'>
                        주소
                    </h2>
                    <input className='my-2 w-full text-[15px] font-[200] outline-none' value={address.address1 || ''} onChange={handleChange} name='address1' placeholder='우편 번호 검색 후, 자동입력 됩니다.' readOnly={true} />
                </div>
                <div className='mb-4 '>
                    <h2 className='text-[14px]'>
                        상세 주소
                    </h2>
                    <input className='my-2 w-full text-[15px] font-[200] outline-none mb-4 border-b-[1px] pb-2 focus:login-focus' placeholder='건물, 아파트, 동/호수 입력' onChange={onChangeHandler} name='detail' value={detail || ''} ref={focusDetail}/>
                </div>
                <div className='flex items-center'>
                    <button className={`border w-[24px] h-[24px]  ${check ? 'bg-black' : 'bg-white'}`} onClick={onCheck}></button> <h2 className='ml-2 text-[12px]'>기본 배송지로 설정</h2>
                </div>
                <div className='flex justify-center my-8'>
                    <button className='border w-[120px] h-[42px] rounded-xl text-[12px]' onClick={onClickHandler} name='cancel'>취소</button>
                    <button type='button' className={`border w-[120px] h-[42px] rounded-xl ml-2 text-[12px] text-white ${!submitConfirm ? 'bg-black' : 'bg-[#ebebeb] disabled'}`} disabled={submitConfirm} onClick={onClickHandler} name='submit'>저장하기</button>
                </div>
            </div>
        </div>
    )
}
export default addAddress;