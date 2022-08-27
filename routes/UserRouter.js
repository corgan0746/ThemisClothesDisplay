const express = require('express');
const passport = require('passport');
const {createAccount, getOrders} = require('../db/index');


const userRouter = express.Router();



userRouter.post('/register', (req, res, next) => {
    console.log(req.body);
    const {username, email, password} = req.body;
    if(!(username && email && password)) {
        console.log('fields are missing');

        res.render('login', {message: 'Missing fields on register', error: null});
        return;
    }
    createAccount(username, password, email).
    then((result) => {
        if(typeof result === 'object'){
            res.render('login', {error: null, message: 'Error creating user'});
        }else{
        res.render('login', {error: null, message: 'User Created'});
        }
    }).catch((err) => {
        console.log(err);
        res.send('<h1>Error creating user</h1>')
    })


});

userRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
    if(req.user){
        req.session.userId = req.user.id;
        req.session.data = {username: req.user.username, email: req.user.email, cart: [], total: 0};

        res.redirect('/');
       
    }else {
        res.render('login', {error : 'Error on password/username field', message: null});
    }

});

userRouter.post('/logout', (req, res) => {
    req.logOut((error) => {
        if(error) {return next(error);}

        res.redirect('/');
    });

    
});

userRouter.get('/account', async (req, res, next) => {
    if(!req.user){
        res.redirect('/login');
    }
    const ordersIds = [];
        try{
            const result = await getOrders(req.session.userId);

            const filterIds = result;

            filterIds.filter((ele) => {

                const isUnique = ordersIds.includes(ele.order_id);
        
                if(!isUnique){
                    ordersIds.push(ele.order_id);
        
                    return true;
                }else {
                    return false;
                }
            }) 

            const ordersMade = [];

            ordersIds.map((currentOrder) => {

                let arrAux = [];

                result.map((ele) => {
                    if(ele.order_id === currentOrder){
                        arrAux.push({product_id:ele.product_id, quantity: ele.quantity});
                    }
                })
                ordersMade.push({currentOrder:currentOrder, items: arrAux});
            })

            console.log(ordersMade);

            res.render('account', {user: req.session.data.username, email: req.session.data.email, orders: ordersMade});

        }catch(err){
            console.log(err);
        }

});



userRouter.get('/cart', (req, res, next) => {
    if(!req.user){
        res.redirect('login');
    }


    const data = {items: req.session.data.cart, total: req.session.data.total};

    res.render('cart', {data});
});

userRouter.get('/deleteItem/:item', (req, res) => {

    if(!req.user){
        res.redirect('login');
    }

    const item = Number(req.params.item);

    req.session.data.total -=  req.session.data.cart[item].subTotal;

    req.session.data.cart.splice(item, 1);

    res.redirect('/cart');
});


userRouter.get('/login', (req, res, next) => {
    if(req.user){
        res.redirect('/');
    }

    res.render('login', {error: '', message: null});
});


module.exports = userRouter;