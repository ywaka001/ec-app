import * as Actions from './actions'
import initialState from '../store/initialState'
//state　現在の状態or現在の状態が指定されてない場合は初期状態
//actionがreturnした値
export const UserReducer = ( state = initialState.users, action) => {
    switch (action.type) {
        case Actions.FETCH_ORDERS_HISTORY:
            return{
                ...state,
                orders: [...action.payload]
            };        
        case Actions.FETCH_PRODUCTS_IN_CART:
            return{
                ...state,
                cart: [...action.payload]
            };
        case Actions.SIGN_IN:
            return{
                ...state,           //現在の状態
                ...action.payload   //actionsで渡された状態で状態を上書きする
                // isSignedIn: action.payload.isSignedIn,
                // role: action.payload.role,
                // uid: action.payload.uid,
                // username: action.payload.username
                // state/action.payloadを「...」でマージしている
            };
            case Actions.SIGN_OUT:
                return{
                    ...action.payload   //actionsで渡された状態で状態を上書きする
                };
            default:
            return state
    }
}