import { useEffect, useState, useCallback } from "react";
import "./styles.css";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      if (!initialDataLoaded || count > 0) {
        const response = await fetch(
          `https://dummyjson.com/products?limit=20&skip=${count * 20}`
        );
        const result = await response.json();

        if (result && result.products && result.products.length) {
          if (count === 0) {
            setProducts([...result.products]);
            setInitialDataLoaded(true);
          } else {
            setProducts((prevData) => [...prevData, ...result.products]);
          }
          console.log(result);
        }
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [count, initialDataLoaded]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products && products.length === 100) {
      setDisableButton(true);
    }
  }, [products]);

  if (loading && products.length === 0) {
    return <div>Loading data! Please wait...</div>;
  }

  return (
    <div className="container">
      <div className="product-container">
        {products && products.length
          ? products.map((item) => (
              <div className="product" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <p>
                  <strong>{item.title}</strong>
                </p>
                <p>
                  {item.stock > 0 ? `${item.stock} in stock` : "Not in stock!"}
                </p>
              </div>
            ))
          : null}
      </div>
      {loading && <div>Loading more products...</div>}
      <div className="button-container">
        <button
          onClick={() => setCount(count + 1)}
          disabled={disableButton || loading}
        >
          Load More Products
        </button>
      </div>
    </div>
  );
}
