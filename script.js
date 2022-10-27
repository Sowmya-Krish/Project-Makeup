let container = document.createElement("div");
let row = document.createElement("div");
let brandName = [];
let productname = [];

let filterAdded = false; 

document.body.appendChild(container);
container.setAttribute("class", "container");


container.innerHTML = `
        <h1 class="heading">Makeup Products</h1>
        <form class="searchContainer row" id="filterData">
            <div class="col-md-4">
            <input
                placeholder="Brand"
                oninput="FilterChange()"
                class="searchInput"
                id="brandName"
                value=""
            />
            </div>
            <div class="col-md-4">
            <input
                placeholder="Name of the product"
                oninput="FilterChange()"
                class="searchInput"
                id="productType"
                value=""
            />
            </div>
            <div class="buttonsWrapper" >
                <a class="waves-effect waves-light btn disabled" id="filterSubmit" onclick="ApplyFilter()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
</svg>
                Search</a>
                
            </div>
        </form>
        <div class="availabilitiesWrapper">
        <button class="availabilities"  id="availableBrands" onclick="handleAvailableBrands()">Brands</button>
          <div class="brandsWrapper" style="display:none"></div>
        <button class="availabilities"  id="availableProducts" onclick="handleAvailableProducts()">Products</button>
          <div class="productTypesWrapper" style="display:none"></div>
        </div>
        <p id="noItems">No items found!!</p>
        <div class="spinnerWrapper">
            <div class="loader"></div>
            <p6><b>Loading...   Please wait!!!!!!</b></p6>
        </div>`;

container.appendChild(row);
row.setAttribute("class", "row");


let brandNameInput = document.getElementById("brandName");
let prodTypeInput = document.getElementById("productType");
let spinner = document.querySelector(".spinnerWrapper");
let noItemsPara = document.getElementById("noItems");
let brandsWrapper = document.querySelector(".brandsWrapper");
let availableBrands = document.getElementById("availableBrands");
let productTypesWrapper = document.querySelector(".productTypesWrapper");
let availableProductsTypes = document.getElementById("availableProducts");
let filterButton = document.getElementById("filterSubmit");
let clearFilterButton = document.getElementById("clearFilter");
let filterInput = document.getElementsByClassName("searchInput");


console.log(filterInput);
Array.from(filterInput).forEach((item) => {
  console.log("l", item);
  item.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      document.getElementById("filterSubmit").click();
    }
  });
});
for (let i = 0; i < filterInput.length; i++) {
  console.log(filterInput[i]);
}


function queryParamFormat(word) {
  let formattedWord = word
    .split(" ")
    .map((item) => item.toLowerCase())
    .join("_");
  return formattedWord;
}


function FilterChange() {
  if (brandNameInput.value || prodTypeInput.value) {
   
    console.log("filterAdded", filterAdded);
    filterButton.classList.remove("disabled");
    clearFilterButton.classList.remove("disabled");
  } else if (!brandNameInput.value && !prodTypeInput.value && !filterAdded) {
  
    console.log("filterAdded", filterAdded);
    filterButton.classList.add("disabled");
    clearFilterButton.classList.add("disabled");
  }
}

function ApplyFilter() {
  getproducts(
    brandNameInput.value.toLowerCase(),
    queryParamFormat(prodTypeInput.value)
  );
  spinner.style.display = "flex";
  noItemsPara.style.display = "none";
  row.innerHTML = "";
  filterAdded = true;

}

function ClearFilter() {
  brandNameInput.value = "";
  prodTypeInput.value = "";
  console.log(filterAdded);
  clearFilterButton.classList.add("disabled");
  filterButton.classList.add("disabled");
  if (filterAdded) {
    
    row.innerHTML = "";
    getproducts();
    filterAdded = false;
  }
}


const handleAvailableBrands = () => {
  console.log("mm", availableBrands, brandsWrapper);
  if (brandsWrapper.style.display === "none") {
    brandsWrapper.style.display = "flex";
    availableBrands.innerText = "Hide Brands ";
    brandName.forEach((item, index) => {
      let test = item;
      brandsWrapper.innerHTML += `<div class="brandAndProds" id=brand${index} onclick="setBrandFilter(${index})">${item}</div>`;
    });
  } else {
    brandsWrapper.style.display = "none";
    availableBrands.innerText = "View Brands ";
  } 

  
};


const handleAvailableProducts = () => {
  console.log("mm", availableProductsTypes, productTypesWrapper);
  if (productTypesWrapper.style.display === "none") {
    productTypesWrapper.style.display = "flex";
    availableProductsTypes.innerText = "Hide Products ";
    productname.forEach((item, index) => {
      productTypesWrapper.innerHTML += `<div class="brandAndProds" id=product${index} onclick="setProductFilter(${index})">${item}</div>`;
    });
  } else {
    productTypesWrapper.style.display = "none";
    availableProductsTypes.innerText = "View Products ";
  }
 
 
};


const setBrandFilter = (index) => {
  let name = document.getElementById(`brand${index}`).innerText;
  brandNameInput.value = name;
  FilterChange();
};


const setProductFilter = (index) => {
  console.log(index);
  let name = document.getElementById(`product${index}`).innerText;

  prodTypeInput.value = name;
  FilterChange();
};


function handleSuccess(makeupProducts) {
  spinner.style.display = "none"; 
  brandNameInput.removeAttribute("disabled"); 
  prodTypeInput.removeAttribute("disabled");
  availableBrands.removeAttribute("disabled");
  availableProductsTypes.removeAttribute("disabled");
  console.log(makeupProducts);
  let productsBrands = makeupProducts.map((item) => item.brand);
  let productsTypes = makeupProducts.map((item) =>
    item.product_type.split("_").join(" ")
  );
  if (!filterAdded) {
    brandName = productsBrands
      .filter((item, i) => productsBrands.indexOf(item) === i)
      .sort();
    productname = productsTypes
      .filter((item, i) => productsTypes.indexOf(item) === i)
      .sort();
  }

  console.log("brandname", brandName, productname);

  console.log(makeupProducts, Array.isArray(makeupProducts), makeupProducts.length);
  if (!makeupProducts.length) {
    noItemsPara.style.display = "block"; 
    return;
  }
  row.innerHTML = "";
  console.log(makeupProducts);
  makeupProducts.forEach((item) => {
    let truncatedDescription =
      item.description.length > 400
        ? `${item.description.substring(0, 400)}...`
        : item.description; 
    row.innerHTML += `
    <div class="col-sm">
        <a class="prodContainer" target="_blank" href=${item.product_link}>
            <img
            class="prodImage"
            alt=${item.name}
            src=${
              item.image_link
                ? item.image_link
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
            }
            />
            <div class="details">
               
                <div class="brandName"><span>Name</span> : ${item.name} ${
      item.product_type ? `(${item.product_type.split("_").join(" ")})` : ""
    }</div>
                <div class="brandName"><span>Brand</span> : ${item.brand}</div>
                <div><span>Price</span> : ${
                  item.price_sign ? item.price_sign : "$"
                } ${item.price}</div>
                <div>${truncatedDescription}</div>
            </div>
        </a>
    </div>`;
  });
}


async function getproducts(brandName, prodType) {
  console.log("prods", brandName, prodType);

  console.log(spinner);
  spinner.style.display = "flex"; 
  noItemsPara.style.display = "none"; 
  brandNameInput.setAttribute("disabled", "true"); 
  prodTypeInput.setAttribute("disabled", true);
  availableBrands.setAttribute("disabled", true);
  availableProductsTypes.setAttribute("disabled", true);
  console.log("");
  await fetch(
    `https://makeup-api.herokuapp.com/api/v1/products.json${
      brandName ? "?brand=" + brandName : "?brand="
    }${prodType ? "&product_type=" + prodType : ""}`
   
  )
    .then((data) => data.json())
    .then((makeupProducts) => {
      handleSuccess(makeupProducts);
    })
    .catch((err) => {
      console.log("fetcherr", err);
      if (err.message === "Failed !!!! Try Again") {
        noItemsPara.style.display = "block";
        spinner.style.display = "none"; 
        noItemsPara.innerText = `${err.message}`; 
      }
      console.log(err);
    });
}

getproducts();
