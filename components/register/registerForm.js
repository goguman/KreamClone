import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import {filedChange} from "../../store/slices/loginSlice";
import {useState, useRef, useEffect, useCallback} from 'react';
import PopUpSize from './popUpSize';
import {faPlus, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Terms from './Terms';
import useInput from '../../hooks/useInput';
import {emailCheck, pwdCheck} from '../../hooks/InputValidation';
import axios from 'axios';
import {useQuery} from 'react-query';
import {useRouter} from 'next/router';
import signUp from '../../pages/api/auth/signUp';

const registerForm = () => {
    const [emailExist, setEmailExist] = useState(false);
    const [openSize, setOpenSize] = useState(false);
    const [size, setSize] = useState('');
    const router = useRouter();
    const checkRef = useRef([]);
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [ isEmail, setIsEmail ] = useState(true);
    const [ isPassword, setIsPassword ] = useState(true);
    const [isTerms, setIsTerms] = useState(false);
    const [isMessage, setIsMessage] = useState(false);
    const [recEmail, setRecEmail] = useState(false);

    const [choice, setChoice] = useState(
        {
            option1 : false,
            option2 : false,
            option3 : false,
            optionAll : false,
        }
    )

    const onClickPop = () => {
        if (size !== '') {
            setSize(size);
        }
        setOpenSize(true);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(isEmail && isPassword && size && isTerms) {
            console.log(choice);
            try {
                 axios.post('/api/auth/signUp',
                    {
                        email : email,
                        password : password,
                        size : size,
                        message_receive : isMessage,
                        email_receive : recEmail,
                        image : '/images/mypage/defaultUser.png'
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                 )
                     .then(res => {
                         if(res.status === 201){
                             router.push('/');
                         }
                     })
            } catch (e) {
                console.log(e);
            }
        }
    }
    const changeHandler = useCallback((e) => {
            const {name, value} = e.target;
            if(name === 'userId'){
                setEmail(value);
                if(!emailCheck(email)){
                    setIsEmail(false);
                }else {
                    setIsEmail(true);
                }
            }
            if(e.target.name === 'password'){
                setPassword(e.target.value);
                if(!(pwdCheck(e.target.value))){
                    setIsPassword(false);
                }else {
                    setIsPassword(true);
                }
            }
        },[email,password]);
    useEffect(() => {
        if(!isEmail){
            checkRef.current['idDiv'].style.color = 'red';
        }else {
            checkRef.current['idDiv'].style.color = 'black';
        }
        if(!isPassword){
            checkRef.current['pwdDiv'].style.color = 'red';
        }else {
            checkRef.current['pwdDiv'].style.color = 'black';
        }
    }, [isEmail,isPassword, isMessage]);
    useEffect(() => {
        if(isEmail) {
            axios
                .get('http://localhost:4000/register', {params: {email: email}}, {withCredentials: true})
                .then((res) => {
                    if (res.data.length > 0) {
                        setIsEmail(false);
                        setEmailExist(true);
                    } else {
                        setEmailExist(false);
                    }
                })
                .catch((error) => console.log(error));
        }
    }, [email]);



    return (
        <div className="md:container md:mx-auto flex justify-center z-0">
            <div className=" py-28 text-center w-96 ">
                <h1 className="font-semibold text-3xl">????????????</h1>
                <div>
                    <div className="pt-16 w-full text-left" ref={(idDiv) => {
                        checkRef.current['idDiv'] = idDiv
                    }}>
                        <h2 className="font-normal text-sm">????????? ??????*</h2>
                        <input type="email" placeholder="???)Kream@Kream.co.kr"
                               className="border-b-2 font-thin w-full h-10 focus:login-focus"
                               style={!isEmail ? {borderBottomColor : 'red'} : {borderBottomColor : 'inherit'}}
                               onChange={changeHandler}
                               name='userId'
                               autoComplete='off'
                        />
                        {!isEmail ? (emailExist ? <p className='text-[6px]'>?????? ?????? ?????? ??????????????????.</p> : <p className='text-[6px]'>????????? ????????? ????????? ??????????????????.</p>) : null }
                    </div>
                    <div className="pt-8 w-full text-left" ref={(pwdDiv) => {
                        checkRef.current['pwdDiv'] = pwdDiv }}>
                        <h3 className="font-normal text-sm">????????????*</h3>
                        <input type="password" placeholder="??????, ??????, ???????????? ?????? 8-16???"
                               className="border-b-2 font-thin w-full h-10 focus:login-focus"
                               name='password'
                               onChange={changeHandler}
                               style={!isPassword ? {borderBottomColor : 'red'} : {borderBottomColor : 'inherit'}}
                        />
                        {!isPassword ? <p className='text-[6px]'>??????, ??????, ??????????????? ???????????? ??????????????????. (8-16???)</p> : null }
                    </div>
                    <div className="pt-8 w-full text-left ">
                        <h3 className="font-normal text-sm">?????? ?????????</h3>
                        <div className='flex border-b-2 items-center'>
                            <button className=" font-thin w-full h-10 focus:login-focus text-start font-medium"
                                    name='size' onClick={() => onClickPop()}>
                                {(size === '') ? (<p className='text-gray-400 font-thin'>???????????????</p>) : (size)}
                            </button>
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </div>
                    </div>
                   <Terms setIsTerms={setIsTerms} setRecEmail={setRecEmail} setIsMessage={setIsMessage}/>
                    <div className="pt-8 w-full ">
                        {isEmail && isPassword && isTerms ?
                        <button className="border-2 w-full h-12 rounded-lg font-bold text-white"
                                style={{backgroundColor: 'black', borderColor: 'balck'}} onClick={(e)=> onSubmit(e)}>????????????
                        </button>
                            :
                        <button className="border-2 w-full h-12 rounded-lg font-bold text-white"
                                style={{backgroundColor: '#ebebeb', borderColor: '#ebebeb'}} disabled>????????????
                        </button>}
                    </div>
                </div>
                {openSize ? (
                    <PopUpSize openSize={openSize} size={size} setOpenSize={setOpenSize} setSize={setSize} setMessage={setIsMessage} />) : null}
            </div>
        </div>
    )
}

export default registerForm;
