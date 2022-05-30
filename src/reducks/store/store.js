import { connectRouter, routerMiddleware } from "connected-react-router";
import{
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from "redux";
import thunk from "redux-thunk";

import { ProductsReducer } from "../products/reducers";
import { UserReducer } from "../users/reducers";

export default function createStore(history){
    return reduxCreateStore(
        combineReducers({
            products: ProductsReducer,
            router: connectRouter(history),
            users: UserReducer
        }),
        applyMiddleware(
            routerMiddleware(history),
            thunk
        )
    )
}
