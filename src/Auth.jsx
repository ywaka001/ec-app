import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getSignedIn, getUserId} from "./reducks/users/selectors";
import {listenAuthState} from "./reducks/users/operations";

const Auth = ({children}) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);

    const isSignedIn = getSignedIn(selector)
    const uid = getUserId(selector)

    useEffect(() => {
        if (!isSignedIn) {
            dispatch(listenAuthState())
        }
    }, []);
    
    console.log('isSignedIn⇒⇒⇒' + isSignedIn + '   uid:' + uid)
    if (!isSignedIn) {
        console.log('selector⇒' + selector.users.isSignedIn)
        return <></>
    } else {
        return children
    }
};

export default Auth;