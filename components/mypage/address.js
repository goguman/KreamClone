import AddAddress from './addAddress';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2';

const address =  () => {
    const [openAddress, setOpenAddress] = useState(false);
    const {data : session} = useSession();
    const queryClient = useQueryClient();
    const [editAddr, setEditAddr] = useState();
    const [baseAddress, setBaseAddress] = useState([]);
    const onAddAdddress = () => {
        setEditAddr();
        setOpenAddress(true);
    }
    function onRemoveAddr(addr_id) {
        if(baseAddress.ADDRESS_ID === addr_id){
            let timerInterval;
            Swal.fire({
                icon: 'error',
                position : 'top',
                background : '#222',
                color : 'white',
                width : '480px',
                fonstSize : '11px',
                showConfirmButton : false,
                text: '다른 주소를 기본배송지로 변경 후, 삭제할 수 있습니다. ',
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
        }else {
            try {
                axios.post(`http://localhost:4000/myPage/removeAddr`, { params : { user_id : session.userId, address_id : addr_id}})
                    .then((res) => {
                        queryClient.invalidateQueries({queryKey : ['addressList'], refetchActive : true});
                    })
                    .catch((error) => console.log(error));
            }catch(e){
                console.log(e);
            }
        }

    }
    const {status, data : addressInfo } = useQuery("addressList", async () => {
           const { data } = await axios.post(`http://localhost:4000/myPage/getAddress`, {params : { user_id : session.userId }});
           return data;
    });
    const defaultHandler = (addr_id) => {
        axios.post(`http://localhost:4000/myPage/defaultAddress`, { params : { user_id : session.userId, address_id : addr_id}})
            .then((res) => {
                queryClient.invalidateQueries({queryKey : ['addressList'], refetchActive : true});
            })
            .catch((error) => console.log(error));
    }
    const editHandler = (addr) => {
        setEditAddr(addr);
        setOpenAddress(true);

    }
    useEffect(() => {
        if(status === 'success') {
            setBaseAddress(addressInfo.filter(address => address.DEFAULT_YN === 'Y')[0]);
        }
    }, [openAddress, addressInfo, status])
    return (
        <div className='max-w-[680px]'>
            <div className='text-[22px] font-semibold flex'>
                주소록
                <button className='ml-auto border-[1px] border-black text-[13px] px-2 font-[300] rounded-lg' onClick={onAddAdddress}> + 새 배송지 추가</button>
            </div>
            {
                openAddress ?
                    <AddAddress setOpenAddress={setOpenAddress} editAddr={editAddr} setAdd={setEditAddr}/>
                        :
                        null
            }
            {baseAddress === undefined ?
                <div className='flex justify-center items-center'>
                    <div className='font-[200] text-[12px] mt-14'>
                            <h2 className='pl-1'>배송지 정보가 없습니다.</h2>
                            <h2>새 배송지를 등록해주세요.</h2>
                        <button className='ml-2 mt-2 ml-auto border-[1px] text-[12px] py-1 px-4 font-[200] rounded-lg' onClick={onAddAdddress}>새 배송지 추가</button>
                    </div>

                </div>
                :
                <div className='pt-8'>
                    <div className='flex flex-col border-b-[2px] border-black text-[14px] pb-6'>
                        <div className='flex items-center'>
                            <div className='font-[500]'>{baseAddress.NAME}</div>
                            <div className='border-[1px] bg-gray-100 rounded-lg px-2 text-[12px] ml-2'>기본 배송지</div>
                        </div>
                        <div className='pt-1 flex'>
                            <div>
                                <h2>{baseAddress.PHONE}</h2>
                                <span>({baseAddress.POSTCODE})</span><span> {baseAddress.ADDRESS1} {baseAddress.ADDRESS2}</span>
                            </div>
                            <div className='ml-auto'>
                                <button className='ml-2 border-[1px] px-2 rounded-lg py-1 text-[13px] font-[300]' onClick={()=>editHandler(baseAddress)}>수정
                                </button>
                                <button className='ml-2 border-[1px] px-2 rounded-lg py-1 text-[13px] font-[300]' onClick={()=>onRemoveAddr(baseAddress.ADDRESS_ID)}>삭제
                                </button>
                            </div>
                        </div>
                    </div>
                    {addressInfo !== undefined && addressInfo.filter(data => data.DEFAULT_YN !== 'Y').map((address, index) => (
                        <div className='pt-8 flex border-b-[1px] pb-4' key={index}>
                            <div className='text-[13px]'>
                                <h2>{address.NAME}</h2>
                                <h2>{address.PHONE}</h2>
                                <span>({address.POSTCODE})</span><span> {address.ADDRESS1} {address.ADDRESS2}</span>
                            </div>
                            <div className='ml-auto '>
                                <button className='ml-2 border-[1px] px-2 rounded-lg py-1 text-[13px] font-[300]'
                                        onClick={() => defaultHandler(address.ADDRESS_ID)}>기본 배송지
                                </button>
                                <button className='ml-2 border-[1px] px-2 rounded-lg py-1 text-[13px] font-[300]'
                                        onClick={() => editHandler(address)}>수정
                                </button>
                                <button className='ml-2 border-[1px] px-2 rounded-lg py-1 text-[13px] font-[300]'
                                        onClick={() => onRemoveAddr(address.ADDRESS_ID)}>삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default address;