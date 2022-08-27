

const generateProducts = (amount) => {

    const brand = ['Nike', 'Karrimor', 'Adidas', 'Puma', 'DC'];

    //const category = [1 ,2 , 3] ;

    const type = ['Shoes', 'Shirt', 'Pants'];

    const price = [9.99 , 14.99, 25.00 , 30.00, 50.00 ];

    const color = ['White', 'Blue', 'Yellow', 'Black', 'Red', 'Brown'];

    const Rand = (num) => Math.floor(Math.random() * num)

    const products_arr = [];

    for(let i = 0; i < amount; i++){

        let current_product = {
            //category_id: `${category[Rand(category.length)]}`,
            name: `${brand[Rand(brand.length)]} ${type[Rand(type.length)]} ${color[Rand(color.length)]}`,
            price: price[Rand(price.length)]
            }

        products_arr.push(current_product);

    }

    return products_arr;
}



const generateOrders = (order_id, ids) => {
    
    const item_id = ids; 

    const quantity = [1,2,3];

    const Rand = (num) => Math.floor(Math.random() * num);

    const different_items = quantity[Rand(quantity.length)];

    let query = '';

    for(let i =0 ;i<different_items; i++){

        query += `(${order_id}, ${item_id[Rand(item_id.length)]}, ${quantity[Rand(quantity.length)]}) ,`

    }

    query = query.slice(0, query.length-1);

    query = `INSERT INTO order_items(order_id, product_id, quantity) VALUES${query}`;

    return query;

}

const defineImage = (arr) => {
    const newArr = [];

    let num

    arr.map((ele) => {
        if(ele.name.toLowerCase().includes('shoes')){
            num = 1;
        }else if(ele.name.toLowerCase().includes('shirt')){
            num = 2;
        }else if(ele.name.toLowerCase().includes('pants')){
            num = 3;
        }

        newArr.push({...ele, type:num});
    })

    return newArr
}




module.exports = {generateProducts, generateOrders, defineImage};
