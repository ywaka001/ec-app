import {db, FirebaseTimestamp, FirebaseTimestamp2 } from "../../firebase"
import { collection, doc, setDoc, query, getDocs, orderBy, deleteDoc, getDoc, writeBatch, where } from "firebase/firestore";
import { push } from "connected-react-router"
import {fetchProductsAction, deleteProductAction} from './actions'


const productsRef = collection(db, 'products')

export const deleteProduct = (id) => {
    return async (dispatch, getState) =>{
        const deleteRef = doc(db, 'products', id);
        deleteDoc(deleteRef)
            .then(() => {
                const prevProducts = getState().products.list;
                const nextProducts = prevProducts.filter(product => product.id != id)
                dispatch(deleteProductAction(nextProducts))
            })
    }
}


export const fetchProducts = (gender, category) => {
    return async (dispatch) => {

        let q = query(productsRef, orderBy('updated_at', 'desc'))
        q = (gender !=="") ? query(q, where('gender', '==', gender)) : q;
        q = (category !=="") ? query(q, where('category', '==', category)) : q;
        // q = (gender !=="") ? q.where('gender', '==', gender) : q;
        // q = (category !=="") ? q.where('category', '==', category) : q;

        await getDocs(q)
            .then(snapshots => {
                const productList = []
                snapshots.forEach(snapshots => {
                    const product = snapshots.data();
                    productList.push(product) 
                })
            dispatch(fetchProductsAction(productList))
        })

        // productsRef.orderBy('updated_at', 'desc').get()
        //     .then(snapshots => {
        //         const productList = []
        //         snapshots.forEach(snapshots => {
        //             const product = snapshots.data();
        //             productList.push(product)
        //         })

    }
}

export const orderProduct = (productsInCart, amount) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        //const userRef = db.collection('users').doc(uid);
        const userRef = doc(db, "users", uid);
        const timestamp = FirebaseTimestamp2.now();

        let products = [],
            soldOutProducts = [];

        //const batch = db.batch()
        const batch = writeBatch(db);

        for (const product of productsInCart){
//            const snapshot = await productsRef.doc(product.productId).get();
            const docRef = doc(productsRef, product.productId);
            let data = {};
            await getDoc(docRef).then(snapshot => {
                data = snapshot.data();
            })
            const sizes = data.sizes;

            const updatedSizes = sizes.map(size => {
                if (size.size === product.size) {
                    if (size.quantity === 0) {
                        soldOutProducts.push(product.name);
                        return size
                    }
                    return {
                        size: size.size,
                        quantity: size.quantity - 1
                    }
                } else {
                    return size
                }
            })

            products.push({
                id: product.productId,
                images: product.images,
                name: product.name,
                price: product.price,
                size: product.size
            });

            batch.update(
                doc(productsRef, product.productId),
                {sizes: updatedSizes}
            )

            batch.delete(
                doc(userRef, 'cart', product.cartId)
            )

            if (soldOutProducts.length > 0) {
                const errorMessage = (soldOutProducts.length > 1) ?
                                     soldOutProducts.join('と') :
                                     soldOutProducts[0];
                alert('大変申し訳ありません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しました。')
                return false
            } else {
                try {
                    await batch.commit();

                    //const orderRef = userRef.collection('orders').doc();
                    const orderRef = doc(collection(userRef, "orders"));
                    const date = timestamp.toDate();
                    const shippingDate = FirebaseTimestamp2.fromDate(new Date(date.setDate(date.getDate() + 3)));

                    const history = {
                        amount: amount,
                        created_at: timestamp,
                        id: orderRef.id,
                        products: products,
                        shipping_date: shippingDate,
                        updated_at: timestamp
                    }

                    await setDoc(orderRef, history);
                    //orderRef.set(history);
                    dispatch(push('/order/complete'));
                } catch (error) {
                       console.log(error);
                       alert('注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。')
                       return false
                }
                
                // batch.commit()
                //     .then(() => {
                //         const orderRef = userRef.collection('orders').doc();
                //         const date = timestamp.toDate();
                //         const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)));

                //         const history = {
                //             amount: amount,
                //             created_at: timestamp,
                //             id: orderRef.id,
                //             products: products,
                //             shipping_date: shippingDate,
                //             updated_at: timestamp
                //         }

                //         orderRef.set(history);
                //         dispatch(push('/order/complete'));

                //     }).catch(() => {
                //         alert('注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。')
                //         return false
                //     })
            }
        }
    }
}



export const saveProduct = (id, name, description, category, gender, price, images, sizes) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp

        const data = {
            category: category,
            description: description,
            gender: gender,
            images: images,
            name: name,
            price: parseInt(price, 10),
            sizes: sizes,
            updated_at: timestamp
       }
       let ref;
       if (id ==="") {
            ref = doc(productsRef);
            id = ref.id
            data.id = id
            data.created_at = timestamp
        } else {
            ref = doc(productsRef, id);
        }
       return setDoc(ref,data, { merge: true })
            .then(() => {
                dispatch(push('/'))
            }).catch((error) => {
                throw new Error(error)
            })

            // return productsRef.doc(id).set(data)
            // .then(() => {
            //     dispatch(push('/'))
            // }).catch((error) => {
            //     throw new Error(error)
            // })

       
    }
}