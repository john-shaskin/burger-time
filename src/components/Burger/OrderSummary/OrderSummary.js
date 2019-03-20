import React from 'react';

import Aux from '../../../hoc/Auxilliary/Auxilliary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(ingredientKey => {
            return (
                <li key={ingredientKey}> 
                    <span style={{textTransform: 'capitalize'}}>{ingredientKey}</span>: {props.ingredients[ingredientKey]}
                </li>
            )
        });
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A burger that we probably won't spit in.</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: </strong>${props.price.toFixed(2)}</p>
            <p>Continue to Checkout?</p>
            <Button btnType="Danger" clicked={props.purchaseCanceled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
        </Aux>
    );
};

export default orderSummary;