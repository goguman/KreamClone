import Image from "next/image";

const recentProduct = () => {
    const reProduct = [
        {
            name : '롤렉스',
            imgName : 'categoryShoes'
        },
        {
            name : '샤넬',
            imgName : 'categoryShoes'
        },
        {
            name : '에르메스',
            imgName : 'categoryShoes'
        },
        {
            name : '구찌',
            imgName : 'categoryShoes'
        },
        {
            name : '루이비통',
            imgName : 'categoryShoes'
        },
        {
            name : '팔라스',
            imgName : 'categoryShoes'
        },
        {
            name : '어콜드월',
            imgName : 'categoryShoes'
        },
        {
            name : '노스페이스',
            imgName : 'categoryShoes'
        },
        {
            name : '뮤지엄비지터',
            imgName : 'categoryShoes'
        },
        {
            name : '휴먼 메이드',
            imgName : 'categoryShoes'
        },
    ];
    return (
        <div>
            <div className='searchText'>최근 본 상품</div>
            <div className='flex mt-4 overflow-x-auto scrollbar-hide'>
                {reProduct.map((ctTag, index) => (
                    <div className='text-center  mr-2'>
                        <div key={index} className='reProductSt'>
                            <Image src={require(`../../public/images/category/${ctTag.imgName}.png`)} alt={index}  className='m-auto w-fit h-fit'/>
                        </div>
                        <span className='text-sm'>{ctTag.name}</span>
                    </div>

                ))}
            </div>
        </div>
    )
}
export default recentProduct;