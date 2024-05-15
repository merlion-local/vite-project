import { useEffect, useState } from 'react'
import style from './ProductPage.module.css'
import Product from '../Products/types/Product'
import {Link, useParams} from 'react-router-dom'

export default function ProductPage():JSX.Element {
    const { productId } = useParams()
const [product, setProduct] = useState<Product | undefined>(undefined)
async function fetchProduct():Promise<void>{
    const res = await fetch(`https://fakestoreapi.com/products/${productId}`)
    const  obj = await res.json();
    setProduct(obj)
}
useEffect(()=>{
  fetchProduct();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[])

  return (
    <div>
        <h1>Product Page</h1>
        <p>{product?.title}</p>
        <p>{product?.description}</p>
        <p>{product?.price}</p>
        <p>{product?.category}</p>
        <img className={style.image} src={product?.image} alt="" />
        <Link to="../products">К списку товаров</Link>
    </div>
  )
}
