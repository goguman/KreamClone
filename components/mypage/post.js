import DaumPostCode from 'react-daum-postcode';
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Post = (props) => {
    const onClickHandler = (e) => {
        props.setPopUp(false);
    }
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if(data.addressType === 'R'){
            if(data.bname !== ''){
                extraAddress += data.bname;
            }
            if(data.buildingName !== ''){
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '');
        }
        props.setPopUp(false);
        props.setAddress({
            ...props.address,
            address1 : fullAddress,
            postCode : data.zonecode
        });
        props.setDetail('');
    }
    return (
        <div>
            <div className='absolute border w-[600px] top-24 right-[-9%] bg-white border-black rounded-lg'>
                <div className='flex justify-end'>
                    <a className='cursor-pointer pr-4' onClick={onClickHandler}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </a>
                </div>
                <DaumPostCode
                    className='border-t-[1px] border-black'
                    onComplete={handleComplete}
                    style={{height : 450}}
                    autoClose
                    />
            </div>
        </div>
    );
}

export default Post;