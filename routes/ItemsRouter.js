const express = require('express');

const itemRouter = express.Router();

const passport = require('passport');

const utils = require('../utils');


const {getSingleItem, getAllItems, orderCreate, insertItems} = require('../db/index');

itemRouter.param('itemid', (req, res, next, id) => {
    const itemid = id;
    console.log('this is the id');
    console.log(id)
    req.itemid = itemid;
    next()
})


itemRouter.get('/:itemid', (req, res, next) => {

    let mainUser;

    let idI = req.itemid;

    (req.user)? mainUser = req.session.data.username: mainUser = 'Guest';

    



    getSingleItem(idI).then((response) => {
        if(response.length < 1){  
            res.send('no item found'); 
        }

        itemData = utils.defineImage(response)
       
        res.render('item', {mainUser: mainUser, itemData: itemData[0]});
       
    })

})

itemRouter.post('/addItem', async (req, res) => {

    (!req.user) ? res.redirect('/login') : null;
    
    const qty = Number(req.body.qty);
    const itemId = String(req.body.itemid);

   

    try{

      const itemToAdd = await getSingleItem(itemId);

      const itemFound = itemToAdd[0];

      let subTotal = itemFound.price;
      
      subTotal = Number(subTotal) * qty;

      req.session.data.cart.push({...itemFound, qty: qty, subTotal: subTotal});
      req.session.data.total += subTotal; 

    res.redirect('/cart');
    }catch(err) {
        console.log(err);
    }
})

itemRouter.post('/search', async (req, res, next) => {

    let userDis;

    (req.user)? userDis = req.session.data.username :  userDis = 'Guest'; 

    const rawData = [];
    
    const uniqueIds = [];

    const search = req.body.searchParam;
    if(!search){
        res.redirect('/');
    }

    try{
    const words = search.toLowerCase().split(" ");

    const itemsFetched = await getAllItems();

    for(let x of words){
        
        itemsFetched.map((ele) => {
            if(ele.name.toLowerCase().includes(x)){
                rawData.push(ele);
            }
        })
    }

    const result = rawData.filter((ele) => {

        const isUnique = uniqueIds.includes(ele.id);

        if(!isUnique){
            uniqueIds.push(ele.id);
            return true;
        }else {
            return false;
        }
    }) 

    

    let finishedResult = items = utils.defineImage(result);
 
    const data = {items: finishedResult, userDis: userDis}

    res.render('home', { data });
    }catch(err){
        console.log(err);
    }

})

itemRouter.post('/createOrder', async (req, res) => {

    if(!req.user) {
        res.redirect('/login');
    }

    try{
        const createAcc = await orderCreate(req.session.userId);

        const insertItms = await insertItems(req.session.data.cart, req.session.userId);

        req.session.data.cart = [];
        req.session.data.total = 0;

        res.redirect('/account');

        
    }catch(err) {
        console.log(err);
    }

})

module.exports = itemRouter;