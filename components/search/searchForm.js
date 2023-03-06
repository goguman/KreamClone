import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {useState} from "react";
import Recommend from "./recommend";
import PopularSearch from "./popularSearch";
import SearchCategory from "./searchCategory";
import PopularBrand from "./popularBrand";
import RecentProduct from "./recentProduct";

const searchForm = (props) => {
    return (
        <div className='w-screen bg-white h-screen absolute  top-0 flex flex-col z-100 overflow-scroll noneScroll' >
            <div className='max-lg:w-screen  lg:mx-auto container  w-[800px] h-fit' >
                <div className='max-lg:hidden'>
                    <div className='mt-3'>
                        <div className='pt-6  w-full border-b-2 border-b-black items-center font-bold'><input className='w-3/4 h-12 font-normal text-xl focus:outline-none' type='text'  placeholder='브랜드명, 모델명, 모델번호 등'></input></div>
                    </div>
                </div>
                {/*모바일 검색화면*/}
                <div className='lg:hidden w-screen h-14 border-b-2'>
                    <div className='flex ml-6 mt-3'>
                        <div className='flex bg-gray-100 rounded-md w-full h-10 items-center text-gray-400'><FontAwesomeIcon className='flex-initial w-14' icon={faMagnifyingGlass} size='lg'/><input className='w-3/4 bg-gray-100 font-thin font-xs focus:outline-none' type='text' placeholder='브랜드명, 모델명, 모델번호 등'></input></div><button onClick={() => props.setSearchOn(false)} className='w-14 cursor-default'>취소</button>
                    </div>
                </div>

                <div className='fixed  top-4 right-8 max-lg:hidden '>
                    <button onClick={() => props.setSearchOn(false)}><FontAwesomeIcon icon={faXmark} size='xl'/></button>
                </div>

                {/*실시간 검색 순위*/}
            </div>
            <div className='searchLayer'>
                <Recommend />
            </div>
            <div className='searchLayer mt-4'>
                <PopularSearch />
            </div>
            <div className='searchLayer mt-4'>
                <SearchCategory />
            </div>
            <div className='searchLayer mt-4'>
                <PopularBrand />
            </div>
            <div className='searchLayer mt-4'>
                <RecentProduct />
            </div>
        </div>
    )
}

export default searchForm;