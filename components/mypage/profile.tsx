import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
type userType = {
    name : string,
    size : string,
    email : string,
    image : string,
    email_receive : string,
    message_receive : string
}

const profile = () => {
    const {data : session} = useSession();
    const [userInfo, setUserInfo] = useState<userType[] | any>([]);
    useEffect(() => {
        if(session) {
            console.log(session)
            axios.post('/api/auth/userInfo',
                {
                    id : session.userId
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then(res => {
                    setUserInfo(res.data);
                })
        }
    },[]);

    return(
        <div className='max-w-[680px]'>
            <div className='border-b-[3px] border-black pb-3 text-[22px] font-semibold'>
                프로필 정보
            </div>
            <div className='flex mt-10 items-center border-b-[1px] pb-12'>
                <div>
                    <img className='border w-[100px] h-[100px] rounded-[50%]' src = {session.user.image ? session.user.image : userInfo.image}
                         width={80}/>
                </div>
                <div className='flex flex-col ml-4 '>
                    <div className='ml-3 text-[24px] font-semibold'>
                        {userInfo.name}
                    </div>
                    <div className='flex pt-2'>
                        <div className='ml-2 border-2 rounded-lg px-4 py-1 text-[12px] text-[rgba(34,34,34,.8)]'>
                            <button>이미지 변경</button>
                        </div>
                        <div className='ml-2 border-2 rounded-lg px-4 py-1 text-[12px] text-[rgba(34,34,34,.8)]'>
                            <button>삭제</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-[480px]'>
                <div className='flex flex-col pt-6'>
                    <div className='font-semibold text-[18px] pb-2'>
                        로그인 정보
                    </div>
                    <div className='border-b-[1px] pb-4 text-[rgba(34,34,34,.5)] text-[14px]'>
                        <p className='font-[700]'>이메일 주소</p>
                        <div className='flex items-center text-[16px]'>
                            <p>{userInfo.email}</p> <button className='ml-auto border-[1px] rounded-lg px-3 py-2 text-[12px] text-[rgba(34,34,34,.8)]'> 변경</button>
                        </div>
                    </div>
                    <div className='border-b-[1px] pb-4 pt-4 text-[rgba(34,34,34,.5)] text-[14px]'>
                        <p className='font-[700]'>비밀번호</p>
                        <div className='flex items-center text-[16px]'>
                            <p className='text-black text-[14px]'>●●●●●●●●●</p> <button className='ml-auto border-[1px] rounded-lg px-3 py-2 text-[12px] text-[rgba(34,34,34,.8)]'> 변경</button>
                        </div>
                    </div>
                </div>
                <div className='pt-8'>
                    <div className='font-semibold text-[18px]'>
                        개인 정보
                    </div>
                    <div className='border-b-[1px] pb-4 pt-4 text-[rgba(34,34,34,.5)] text-[14px]'>
                        <p className='font-[700]'>이름</p>
                        <div className='flex items-center text-[16px]'>
                            <p className='text-black text-[14px]'>{userInfo.name}</p> <button className='ml-auto border-[1px] rounded-lg px-3 py-2 text-[12px] text-[rgba(34,34,34,.8)]'> 변경</button>
                        </div>
                    </div>
                    <div className='border-b-[1px] pb-4 pt-4 text-[rgba(34,34,34,.5)] text-[14px]'>
                        <p className='font-[700]'>휴대폰 번호</p>
                        <div className='flex items-center text-[16px]'>
                            <p className='text-black text-[14px]'>●●●●●●●●●</p> <button className='ml-auto border-[1px] rounded-lg px-3 py-2 text-[12px] text-[rgba(34,34,34,.8)]'> 변경</button>
                        </div>
                    </div>
                    <div className='border-b-[1px] pb-4 pt-4 text-[rgba(34,34,34,.5)] text-[14px]'>
                        <p className='font-[700]'>신발 사이즈</p>
                        <div className='flex items-center text-[16px]'>
                            <p className='text-black text-[14px]'>{userInfo.size}</p> <button className='ml-auto border-[1px] rounded-lg px-3 py-2 text-[12px] text-[rgba(34,34,34,.8)]'> 변경</button>
                        </div>
                    </div>
                </div>
                <div className='pt-8'>
                    <div className='font-semibold text-[18px]'>
                        광고성 정보 수신
                    </div>
                    <div className='flex text-[14px] pt-4 items-center border-b-[1px] pb-4'>
                        <p className='text-[15px]'>문자 메시지</p> <div className='ml-auto'><span>수신 동의 </span><input type='radio' name='receive' className='accent-black' /><span className='pl-4'>수신 거부  </span><input type='radio' name='receive' className='accent-black'/></div>
                    </div>
                    <div className='flex text-[14px] pt-6 items-center border-b-[1px] pb-4'>
                        <p className='text-[15px]'>이메일</p> <div className='ml-auto'><span>수신 동의 </span><input type='radio' name='receive' className='accent-black'/><span className='pl-4'>수신 거부  </span><input type='radio' name='receive' className='accent-black'/></div>
                    </div>
                </div>

                <button className='border-b text-[12px] text-[rgba(34,34,34,.5)] pt-14'>회원탈퇴</button>
            </div>
        </div>
    )
}

export default profile;
