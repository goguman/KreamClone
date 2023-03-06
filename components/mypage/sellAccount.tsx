import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faBars, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from 'react';
import getBank from '../../lib/getBank';
import searchAccount from '../../lib/searchAccount';
import { onlyNumber } from '../../hooks/InputValidation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2';

type paramsType = {
    user_id : string,
    bank : string,
    accountNumber : string,
    userName : string
}
const sellAccount = () => {
    const [bank, setBank] = useState<string>();
    const [checked, setChecked] = useState<number>();
    const {data} = getBank();
    const errorDiv = useRef([]);
    const [isBankList, setIsBankList] = useState<boolean>(false);
    const [account, setAccount] = useState<string>();
    const [userName, setUserName] =useState<string>();
    const [clear, setClear] = useState<boolean>();
    const { data : session } = useSession();
    const userAccount  = searchAccount(session.userId);
    const queryClient = useQueryClient();
    const onChangeAccount = (event : React.MouseEvent<HTMLButtonElement>) => {
        axios.post(`http://localhost:4000/myPage/updateAccount`,{params : {user_id: session.userId, bank : bank, accountNumber : account, userName : userName}})
            .then((res) => {
                queryClient.invalidateQueries({queryKey : ['getAccount'], refetchActive : true})
                let timerInterval;
                Swal.fire({
                    icon: 'success',
                    position : 'top',
                    background : '#222',
                    color : 'white',
                    width : '480px',
                    fonstSize : '14px',
                    showConfirmButton : false,
                    text: '계좌 변경 성공',
                    timer: 800,
                    timerProgressBar: true,
                    didOpen: () => {
                        timerInterval = setInterval(() => {
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            })
            .catch((error) => console.log(error));
    }
    const onSetAccount = (event : React.MouseEvent<HTMLButtonElement>) => {
        axios.post(`http://localhost:4000/myPage/insertAccount`,{params : {user_id: session.userId, bank : bank, accountNumber : account, userName : userName}})
            .then((res) => {
                queryClient.invalidateQueries({queryKey : ['getAccount'], refetchActive : true})
                let timerInterval;
                Swal.fire({
                    icon: 'success',
                    position : 'top',
                    background : '#222',
                    color : 'white',
                    width : '480px',
                    fonstSize : '14px',
                    showConfirmButton : false,
                    text: '계좌 등록 성공',
                    timer: 800,
                    timerProgressBar: true,
                    didOpen: () => {
                        timerInterval = setInterval(() => {
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                })
            })
            .catch((error) => console.log(error));
    }
    const onChangeSet = (event : React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.name === 'accountNumber') {
            setAccount(event.target.value.replace(/[^0-9]/g, ''));
        }
        if(event.target.name === 'userName') {
            setUserName(event.target.value);
        }
    }
    const onBankList = () => {
        if(!isBankList){
            setIsBankList(true);
        }else {
            setIsBankList(false);
        }
    }
    const onSetBank = (e : React.MouseEvent<HTMLLIElement>) => {
       setBank(e.currentTarget.innerText);
       setIsBankList(false);
    }
    useEffect(() => {
        if( bank && (account !== undefined && account.length > 1) && (userName !== undefined && userName.length > 1)){
            setClear(true);
        }else {
            setClear(false);
        }
    }, [bank, account, userName])

    return (
        <div className='max-w-[480px]'>
            <div className='text-[22px] font-semibold'>
                정산 계좌 변경
            </div>
            <div className='flex flex-col mt-4 border-[1px] bg-[#fafafa] text-[14px] px-2 py-4 rounded-lg justify-center'>
                <span className='text-[12px] font-[600]'>등록된 계좌 정보</span>
                <span>{userAccount.data !== undefined && userAccount.data.data.length > 0 ? userAccount.data.data[0].USER_BANK+" "+userAccount.data.data[0].ACCOUNT_NUMBER+" "+userAccount.data.data[0].USER_NAME : ''}</span>
            </div>
            <div className='flex flex-col mt-4'>
                <span className='text-[14px]'>은행명</span>
                <div className='border-b-[1px] pb-1 text-[15px] font-[300] flex cursor-pointer' onClick={() => onBankList()}><input type='text' placeholder='선택하세요'  value={bank || ''} readOnly className='outline-none cursor-pointer'/><div className='ml-auto border-[1px] rounded-[50%] w-[24px] h-[24px] flex justify-center'><FontAwesomeIcon icon={faCaretDown} size='lg'/></div></div>
            </div>
                {   isBankList ?
                    <div>
                        <ul className='max-h-[240px] bg-white absolute w-[480px] border-[1px] overflow-y-scroll'>
                            {
                                data.map((name) => (
                                    <li className='pt-[12px] pl-2 text-[13px] font-[200] cursor-pointer' onClick={onSetBank} key={name.BANK_CODE} >
                                        {name.BANK_NAME}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    :
                    ""
                }
            <div className={account !== undefined && account.length <= 1 ? 'text-[red] flex flex-col mt-8' :'flex flex-col mt-8'} >
                <span className='text-[14px]'>계좌번호</span>
                <div className='text-[15px] font-[300] flex cursor-pointer '><input type='text' onChange={onChangeSet} value={account || ''} placeholder='- 없이 입력하세요' className={`w-full  border-b-[1px] pb-1 ${userName !== undefined  && userName.length <= 1 ? 'outline-none border-b-[red]' : 'focus:login-focus'}`} autoComplete='off' name='accountNumber'/></div>
                { account !== undefined && account.length <= 1?<span className='text-[11px] text-[red] font-[200]'>올바른 계좌번호를 입력해주세요.</span> :''}
            </div>
            <div className={userName !== undefined && userName.length <= 1 ? 'text-[red] flex flex-col mt-8' :'flex flex-col mt-8'}>
                <span className='text-[14px]'>예금주</span>
                <div className='text-[15px] font-[300] flex cursor-pointer'><input type='text' onChange={onChangeSet} value={userName || ''} placeholder='예금주명을 정확히 입력하세요' className={`w-full  border-b-[1px] pb-1 ${userName !== undefined  && userName.length <= 1 ? 'outline-none border-b-[red]' : 'focus:login-focus'}`} name='userName' autoComplete='off'/></div>
                { userName !== undefined && userName.length <= 1?<span className='text-[11px] text-[red] font-[200]'>올바른 이름을 입력해주세요. (2-50자)</span> :''}
            </div>
            <div className='flex justify-center mt-12'>
                    <button className={`border-[1px] text-white text-[14px] px-4 py-2 rounded-lg ${clear ? "bg-black" : "bg-gray-200"}`}
                            onClick={userAccount.data !== undefined && userAccount.data.data.length > 0 ? onChangeAccount : onSetAccount}
                            disabled={clear ? false : true}>
                        {userAccount.data && userAccount.data.data.length > 0 ? '변경하기' : '등록하기'}
                    </button>
            </div>
        </div>
    )
}

export default sellAccount;