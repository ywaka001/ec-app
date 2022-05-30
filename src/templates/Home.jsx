import React from "react";
import { getUserId, getUsername } from "../reducks/users/selectors";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signedOut } from '../reducks/users/operations';

const Home = () => {
    const dispatch = useDispatch
    const selector = useSelector(state => state);
    const uid = getUserId(selector)
    const username = getUsername(selector)

    return(
        <div>
            <h2>Home</h2>
            <p>ユーザID：{uid}</p>
            <p>ユーザ名：{username}</p>
            <button onClick={() => dispatch(signedOut())}>SIGN OUT</button>
        </div>
    )
}

export default Home