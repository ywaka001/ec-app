import React, {useEffect} from "react";
import IconButton  from "@material-ui/core/IconButton";
import Badge  from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MenuIcon from "@material-ui/icons/Menu";
import { getProductsInCart, getUserId } from "../../reducks/users/selectors";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { fetchProductsInCart } from "../../reducks/users/operations";
import { push } from "connected-react-router";

const HeaderMenus = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    let productsInCart = getProductsInCart(selector);

    useEffect(() => {
        const docRef = collection(doc(db, "users", uid ), "cart"   );
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                const product = change.doc.data();
                const chageType = change.type;

                switch (chageType) {
                    case 'added':
                        productsInCart.push(product);
                        break;
                    case 'modified':
                        const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
                        productsInCart[index] = product;
                        break;
                    case 'removed':
                        productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
                        break;
                    default:
                        break;
                }

            })       

            dispatch(fetchProductsInCart(productsInCart))
        })

    return () => unsubscribe();
    
    },[]);

    return (
        <>
            <IconButton onClick={() => dispatch(push('/cart'))}>
                <Badge badgeContent={productsInCart.length} color="secondary">
                    <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <IconButton>
                <FavoriteBorderIcon />
            </IconButton>
            <IconButton onClick={(evnet) => props.handleDrawerToggle(evnet)}>
                <MenuIcon />
            </IconButton>
        
        
        </>
    )

}

export default HeaderMenus