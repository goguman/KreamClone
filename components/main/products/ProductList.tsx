import Image from "next/image";
import {useEffect, useState} from "react";
import getProductList from "./getProductList";

    const ProductList = ({title, subTitle, themeName, key}) => {
        const theme = themeName;
        const [Products, setProducts] = useState([]);
        const [Skip, setSkip] = useState(0);
        const [Limit, setLimit] = useState(4);
        const [LoadMoreBtn, setLoadMoreBtn] = useState(true);
        const rowLimit = 4;
        const {data} = getProductList(theme, key);

        useEffect(() => {
            let body = {
                skip: Skip,
                limit: Limit,
            };
            getProducts(body);
        }, [data]);

        const getProducts = (body) => {
            if(data == undefined) return;

            const productInfo = data.slice(body.skip, body.limit);

            if(body.loadMore) {
                setProducts([...Products, ...productInfo]);
            } else {
                setProducts(productInfo);
            }
            if(body.skip + rowLimit >= data.length) {
                setLoadMoreBtn(false);
            }
        }

    const loadMoreHandler = () => {
        let body = {
            skip: Skip + rowLimit,
            limit: Limit + rowLimit,
            loadMore: true
        };
        setLimit(body.limit);
        setSkip(body.skip);
        getProducts(body);
    };

    return (
        <div className="home_products mt-12 max-w-screen-xl mx-auto">
            <div className="product_title px-10 mb-4">
                <div className="title font-bold text-xl">{title}</div>
                <div className="sub_title text-sm text-gray-400">{subTitle}</div>
            </div>
            <div className="product_list_wrap flex md:flex-wrap w-full h-auto px-10 overflow-x-scroll scrollbar-hide md:overflow-auto">
                {
                    data &&
                    Products.map((product, index) =>
                        <div key={index} className="product_item w-[210px] md:w-1/4 px-2 mb-4">
                            <a href="#" className="item_inner px-1 w-[210px] md:w-full block">
                                <div className="thumb_box mx-auto w-fit relative">
                                    <Image className="rounded-xl w-full" style={{background:"#dae1fa"}}
                                           src={product.THUMBNAIL_PATH} alt="" quality={100} width={240} height={240}/>
                                    <div className="btn_wish absolute right-1.5 bottom-1.5 max-w-[24px] max-h-[24px] w-1/12 h-1/12">
                                        <Image className="w-full h-full z-10" src={"/images/bookmark_empty.png"} alt={"bookmark"} width={240} height={240} quality={100} />
                                    </div>
                                </div>
                                <div className="info_box">
                                    <div className="brand underline font-bold">{product.BRAND_NAME}</div>
                                    <div className="name overflow-hidden leading-4 pb-1 font">{product.MODEL_NAME}</div>
                                    <div className="price font-bold">{product.RELEASE_PRICE}원</div>
                                    <div className="text-gray-400 text-xs leading-[0.5rem]">즉시 구매가</div>
                                </div>
                            </a>
                        </div>
                    )
                }
            </div>
            <div className={`load_more_btn_wrap ${LoadMoreBtn ? "flex" : "hidden"}`}>
                <button className="load_more_btn mx-auto mt-4 rounded-lg w-30 h-10 text-gray-500 px-6
                            border border-gray-300" onClick={loadMoreHandler}>
                    더보기
                </button>
            </div>
        </div>
    );
};
export default ProductList;