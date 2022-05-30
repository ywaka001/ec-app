import { fetchOrdersHistoryAction, fetchProductsInCartAction, signInAction, signOutAction } from "./actions";
import { push } from "connected-react-router";
import { auth, db, FirebaseTimestamp } from "../../firebase/index";
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc ,collection, query, getDocs, orderBy } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword , signOut, sendPasswordResetEmail} from "firebase/auth";
import { AlternateEmail } from "@material-ui/icons";
import { async } from "@firebase/util";

export const addProductToCart = (addedProduct) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        //const cartRef = db.collection('users').doc(uid).collection('cart').doc();
        const cartRef = doc(collection(doc(db, "users", uid),"cart"));
        addedProduct['cartId'] = cartRef.id;
        await setDoc(cartRef, addedProduct);
        dispatch(push('/'));
    }
};

export  const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        // db.collection('users').doc(uid).collection('orders').orderBy('updated_at', 'desc').get().then((snapshots) => {
        //     snapshots.forEach( snapshot => {
        //         const date = snapshot.date()
        //         list.push(date)
        //     })

        //     dispatch(fetchOrdersHistoryAction(list))
        // })

        const orderRef = collection(doc(db, "users", uid),"orders");
        const q = query(orderRef, orderBy('updated_at', 'desc'));
        await getDocs(q)
        .then((snapshots) => {
            snapshots.forEach(snapshot => {
                const data = snapshot.data()
                list.push(data)
            })
            dispatch(fetchOrdersHistoryAction(list))
        })

    }
}

export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products))
    }
};

export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid
                console.log('user1:' + uid)
                const docRef = doc(db, "users", uid);
                getDoc(docRef).then(docSnap => {
                    const data = docSnap.data();
                    if (docSnap.exists()) {
                        console.log('user4:' + uid)
                        dispatch(signInAction({
                            isSignedIn:true,
                            role: data.role,
                            uid: uid,
                            username: data.username
                        }))

                    }
                })
            } else {
                dispatch(push('/signin'))
            }
        })
    }
}

export const resetPassword = (email) => {
    return async (dispatch) => {
        if(email === "" ){
            alert("必須項目が未入力です。")
            return false
        } else {
            const auth = getAuth();
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
                    dispatch(push('/signin'))
                }).catch(() =>{
                    alert("パスワードのリセットに失敗しました。")
                })
        }      
    }
}


export const signIn = (email, password) => {
    return async (dispatch) => {
        //Validation
        if(email === "" || password === ""){
            alert("必須項目が未入力です。")
            return false
        }
        
        const auth = getAuth();
        return signInWithEmailAndPassword(auth,email, password)
        .then(result => {
            const user = result.user

            if (user) {
                const uid = user.uid

                const docRef = doc(db, "users", uid);
                getDoc(docRef).then(docSnap => {
                    const data = docSnap.data();
                    
                    if (docSnap.exists()) {
                        dispatch(signInAction({
                            isSignedIn:true,
                            role: data.role,
                            uid: uid,
                            username: data.username
                        }))
                        dispatch(push('/'))
                    }

                })

            }  
        })
    }
}

export const signUp = (username, email, password, confirmPassword) => {
    return async(dispatch) => {
        //Validation
        if(username === "" || email === "" || password === "" || confirmPassword === "" ){
            alert("必須項目が未入力です。")
            return false
        }

        if(password !== confirmPassword){
            alert("パスワードが一致しません。もう一度お試しください。")
            return false
        }

        //console.log(FirebaseTimestamp)
        return createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user
               
                if (user) {
                    const uid = user.uid
                    const timestamp =  FirebaseTimestamp
               
                    const userInitialData = {
                        created_at: timestamp,
                        email: email,
                        role: "customer",
                        uid: uid,
                        updated_at: timestamp,
                        username: username
                    }
                    
                    const ref = doc(db, "users", uid);
                    setDoc(ref, userInitialData).then(() => {
                        dispatch(push('/'))
                    })
                }
            })
    }
}

export const signedOut = () => {
    const auth = getAuth();
        signOut(auth)
            .then(() => {
                return (dispatch) => {
                    dispatch(signOutAction());
                    dispatch(push('/signin'));
                 }
            })
}
