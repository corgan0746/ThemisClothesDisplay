const {Client} = require('pg');


const cliente = new Client('///URL TO MY SQL DATABASE///');

const newEvent = async() => {
  await cliente.connect();
}

newEvent();

  async function verifyUser(user, cb) {

    try{

      const userData = await queryRequest(`SELECT * FROM accounts WHERE username = '${user}'`)
      
      console.log(userData);

      return cb(null, userData[0])    
      
   
    }catch(err){
      return cb(err, null )
    }
    
  }



  async function createAccount(username, password, email){
    try{
      const userExists = await findUser(username);

      if(userExists){
        return new Error('user already exists')
      }else {
        const userCreate =  await queryRequest(`INSERT INTO accounts(password, email, username) VALUES('${password}', '${email}', '${username}')`)
        return 'account created';
      }
      
    }catch(err){
      console.log(err);
    }
  }



   const findUser = async (name) => {
    try{

      console.log('this is the name parameter:')
      console.log(name);

      const result = await queryRequest(`SELECT username FROM accounts WHERE username = '${name}'`);
      
      if(result.length > 0){
        return result;
      }else {
        return null;
      }

    }catch(err){
      console.log(err);
    }
  }
  
  function getUserById(id, cb){
    
      cliente.query(`SELECT id FROM accounts WHERE id = ${id}`,(err, res) => {
        
        if(err){
          console.log(err)
          return cb(err, null);
        }else {
          return cb(null, res.rows[0].id);
        }
      })
    
  }

 

  
   function getAllItems() {

    let items = [];
    
    return new Promise((resolve, reject) => {
      let items = queryRequest(`SELECT * FROM products`);
      resolve(items);
      reject([]);
    })
     
  }



  async function orderCreate(userId) {

    try {
      const createOrder = await cliente.query(`INSERT INTO orders(account_id) VALUES(${userId})`);

      console.log(createOrder);

      return true;

    }catch(err){
      console.log(err)
    }

  }

  


  async function insertItems(cart, userId) {
    
    try {
      let orderId = await queryRequest(`SELECT MAX(id) as order_id FROM orders WHERE account_id = ${userId}`);

      let result = orderId[0];

      console.log('orderId:');
      console.log(result.order_id);

      for (x of cart){
        await queryRequest(`INSERT INTO order_items(order_id, product_id, quantity) VALUES (${result.order_id}, ${x.id} ,${x.qty})`)
      }

      console.log(orderId);
      return true;
    }catch(err) {
      console.log(err);
    }
  }
  
  async function getOrders(userId) {

    try {
      const result = await queryRequest(`SELECT * FROM order_items INNER JOIN orders ON order_items.order_id = orders.id WHERE orders.account_id = ${userId}`);

      return result;

    }catch(err) {

    }
  }
  


  function getSingleItem(id) {
    console.log('getting 1 product');

    return new Promise((resolve, reject) =>{
      let item = queryRequest(`SELECT * FROM products WHERE id = ${id} `);
      resolve(item);
      reject([]);
    })
  }
  

async function queryRequest(inQuery) {
  try{

    const res = await cliente.query(inQuery);
    console.log(`Rows from request:`)
    console.log( res.rows)
    return res.rows;

  }finally{
    //cliente.release();
  }
  
}


  module.exports = {verifyUser, getUserById, getAllItems, findUser, createAccount, getSingleItem, orderCreate, insertItems, getOrders};