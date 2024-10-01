import './App.css';
import React, { useEffect, useState } from 'react';
import Select from "react-select";

function App() {
  const [loading, setLoading] = useState(true);
  const [loadingstores, setLoadingstores] = useState(true);
  const [store, setStore] = useState([]);
  const [product, setProduct] = useState([]);
  const [storeProduct, setStoreProduct] = useState([]);
  const [choseStore, setChooseStore] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chooseProduct, setChooseProduct] = useState([]);
  const [trending, setTrending] = useState([1]);
  const [itemsPerRow, setItemsPerRow] = useState(0);
  const [toppingsPerRow, setToppingsPerRow] = useState(3);
  const [filter, setFilter] = useState(false);
  const options = [
    { value: "name_acs", label: "Name (ACS)" },
    { value: "name_dcs", label: "Name (DCS)" },
    { value: "price_acs", label: "Price (ACS)"},
    { value: "price_dcs", label: "Price (DCS)"}
  ]
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const toppingsOptions = [
    'Milk Foam',
    'Whipped Cream',
    'Chocolate Sauce',
    'Caramel Drizzle',
    'Fruit Toppings'
  ];

  const handleStoreClick = (id) => {
    setChooseStore(id);
    const chooseProductID = storeProduct.filter(sp => sp.shop === id).map(sp => sp.product);
    const products = product.filter(pro => chooseProductID.includes(pro.id));
    
    if (selectedOption.value=="price_acs"){
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setChooseProduct(sortedProducts);
    }
    else if (selectedOption.value=="price_dcs"){
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setChooseProduct(sortedProducts);
    }
    else if (selectedOption.value=="name_acs"){
      const sortedProducts = [...products].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setChooseProduct(sortedProducts);
    }
    else{
      const sortedProducts = [...products].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      setChooseProduct(sortedProducts);
    }
    
  };

  const handleSortedChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log('Selected option:', selectedOption);
    if (selectedOption.value=="price_acs"){
      const sortedProducts = [...chooseProduct].sort((a, b) => a.price - b.price);
      setChooseProduct(sortedProducts);
    }
    else if (selectedOption.value=="price_dcs"){
      const sortedProducts = [...chooseProduct].sort((a, b) => b.price - a.price);
      setChooseProduct(sortedProducts);
    }
    else if (selectedOption.value=="name_acs"){
      const sortedProducts = [...chooseProduct].sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setChooseProduct(sortedProducts);
    }
    else{
      const sortedProducts = [...chooseProduct].sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      setChooseProduct(sortedProducts);
    }

  };

  const handleFilterClick = () =>{
    if (filter==true){
      setFilter(false);
    }
    else{
      setFilter(true);
    }
  } 

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const storeResponse = await fetch('/stores.json');
        if (!storeResponse.ok) {
          throw new Error('Network response was not ok for stores');
        }
        const storeData = await storeResponse.json();
        setStore(storeData.stores);
        setChooseStore(storeData.stores[0].id);

        const productResponse = await fetch('/products.json');
        if (!productResponse.ok) {
          throw new Error('Network response was not ok for products');
        }
        const productData = await productResponse.json();
        setProduct(productData.products);
        
        const response = await fetch('/storeProducts.json'); 
        if (!response.ok) {
          throw new Error('Network response was not ok'); 
        }
        const data = await response.json(); 
        setStoreProduct(data.shopProducts); 

        const id = storeData.stores[0].id;
        const chooseProductID = data.shopProducts.filter(sp => sp.shop === id).map(sp => sp.product);
        const products =  productData.products.filter(pro => chooseProductID.includes(pro.id));
        console.log(products);
        const sortedproducts = [...products].sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        setChooseProduct(sortedproducts);
        
        console.log(chooseProduct);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateItemsPerRow = () => {
    const screenWidth = window.innerWidth-270;
    const cardWidth = 200 + 16 * 2; 
    console.log(screenWidth);
    return Math.floor(screenWidth / cardWidth);
  };

  const calculateToppingPerRow = () => {
    const screenWidth = window.innerWidth-280;
    const cardWidth = 300; 
    console.log(screenWidth);
    return Math.floor(screenWidth / cardWidth);
  };

  useEffect(() => {
    const updateItemsPerRow = () => {
      setItemsPerRow(calculateItemsPerRow());
    };
    const updateToppingPerRow = () => {
      setToppingsPerRow(calculateToppingPerRow());
    }
    updateItemsPerRow(); 
    updateToppingPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    window.addEventListener('resize', updateToppingPerRow);
    return () => {
      window.removeEventListener('resize', updateItemsPerRow);
      window.removeEventListener('resize', updateToppingPerRow);
    };
    
  }, []);

  const toppings = () =>{
      console.log(toppingsOptions);
      const rows = [];
      for (let i=0; i<toppingsOptions.length/toppingsPerRow; i++){
        var toppingList = [];
        for(let j=i*toppingsPerRow; j<Math.min(toppingsOptions.length, i*toppingsPerRow+toppingsPerRow); j++){
          toppingList.push(
            <div className='toppings-item' >
                <input type="checkbox"/>
                <span>{toppingsOptions[j]}</span>
            </div>
          )
        }
        rows.push(
          <div className='flex-container' >
            {toppingList}
          </div>
        )
      }

    if (filter==true)
      return <div className='toppings-filter'>
        <span className='toppings-header'>Toppings:</span>
        <div className='list-toppings'>
          {rows}
        </div>
      </div>;
  }

  const product_nav = () =>{
    const rows = [];
    for(let j=0; j<(chooseProduct.length)/itemsPerRow; j++){
        var productList = [];
        for(let i = j*itemsPerRow; i<Math.min(chooseProduct.length, j*itemsPerRow+itemsPerRow); i++){
            productList.push(
              <div className="card">
              <div className="card-header">
                <div className="card-id">{`MT - ${chooseProduct[i].id}`}</div>
                <div className="card-title">{chooseProduct[i].name}</div>
              </div>
              <hr  />
              <div className="card-toppings">
                <div className='card-toppings'><strong>Toppings:</strong> </div>
                <div className='toppings'>{chooseProduct[i].toppings}</div> 
              </div>
              <div className="card-footer">
                { trending.includes(chooseProduct[i].id)&& (<span className="trending">Trending</span>)}
                <span className="price">{'$'+chooseProduct[i].price}</span>
              </div>
            </div>
            );
        }
        rows.push(
            <div className="flex-nav">
                {productList}
            </div>
        );
    }  
    return rows;
  };

  return (
    <div className="App">
      <div className='sidebar'>
        <div className='sidebar-header'>
          <a>Milk Tea Store</a>
        </div>

        {store.map((item) => (
          <div key={item.id} className={`sidebar-item ${choseStore === item.id ? 'active' : ''}`} onClick={() => handleStoreClick(item.id)}>
            <a>{'Store '+item.id}</a>
        </div> 
        ))}

      </div>
      <div className="content">
          <div className="store-heading" >
            <a>Store {choseStore} Menu </a>
          </div>
          <div className='flex-container'>
            <div className ="filter" onClick={() => handleFilterClick()}>
              Filter
            </div>

            <div className = "sort-filter flex-container">
              {"Sort by"}    
              <Select className='select' options={options} defaultValue={options[0] } onChange={handleSortedChange} />
            </div>
          </div>
          <div >
        </div>
      {toppings()}
      {product_nav()}
      </div>
    </div>

    
  );
}

export default App;
