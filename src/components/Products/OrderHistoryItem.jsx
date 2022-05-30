import React from 'react';
import Divider from '@material-ui/core/Divider';
import {TextDetail} from '../UIkit';
import {OrderedProducts} from './index';

const datetimeTostring = (date) => {
    console.log('Year : ' + date.getFullYear())
    return date.getFullYear() + '-'
        + ('00' + (date.getMonth()+1)).slice(-2) + "-"
        + ('00' + date.getDate()).slice(-2) + " "
        + ('00' + date.getHours()).slice(-2) + ":"
        + ('00' + date.getMinutes()).slice(-2) + ":"
        + ('00' + date.getSeconds()).slice(-2)
}

const dateTostring = (date) => {
    return date.getFullYear() + '-'
        + ('00' + (date.getMonth()+1)).slice(-2) + "-"
        + ('00' + date.getDate()).slice(-2)
}

const OrderHistoryItem = (props) => {
    const order = props.order;
    const orderdDatetime = datetimeTostring(order.updated_at.toDate());
    const shippingDate = dateTostring(order.shipping_date.toDate());
    const price = "￥" + order.amount.toLocaleString();

    return (
        <div>
            <div className='module-space--small' />
            <TextDetail label={"注文ID"} value={order.id} />
            <TextDetail label={"注文日時"} value={orderdDatetime} />
            <TextDetail label={"発送予定日"} value={shippingDate} />
            <TextDetail label={"注文金額"} value={price} />
            {order.products.length > 0 && (
                <OrderedProducts products={order.products} /> 
            )}
            <div className='module-space--extra-extra-small' />
            <Divider />
        </div>
    )

}

export default OrderHistoryItem