import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

const INGREDIENT_PRICES = {
    salad: 0.50,
    cheese: 0.40,
    meat: 1.30,
    bacon: 0.70,
};

class BurgerBuilder extends Component {
    state = {
        totalPrice: 4.00,
        canPurchase: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    // TODO: Re-enable this, once we get to async code and redux
    // componentDidMount() {
    //     axios.get('https://burger-time-b9943.firebaseio.com/ingredients.json')
    //         .then(response => {
    //             if (response && response.status === 200) {
    //                 this.setState({ ingredients: response.data });
    //             }
    //             else {
    //                 this.setState({ error: true });
    //             }
    //         })
    //         .catch(_ => {
    //             this.setState({ error: true });
    //         });
    // }

    updateCanPurchase(ingredients) {
        const sum = Object.keys(ingredients)
            .map(ingredientKey => {
                return ingredients[ingredientKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({ canPurchase: sum > 0 });
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     };
    //     updatedIngredients[type] = updatedCount;

    //     const priceChange = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceChange;
    //     this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //     this.updateCanPurchase(updatedIngredients);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     if (oldCount > 0) {
    //         const updatedCount = oldCount - 1;
    //         const updatedIngredients = {
    //             ...this.props.ings
    //         };
    //         updatedIngredients[type] = updatedCount;

    //         const priceChange = INGREDIENT_PRICES[type];
    //         const oldPrice = this.state.totalPrice;
    //         const newPrice = oldPrice - priceChange;
    //         this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    //         this.updateCanPurchase(updatedIngredients);
    //     }
    // };

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {

        const queryParams = [];
        for (let i in this.props.ings) {
            queryParams.push(`${encodeURIComponent(i)}=${encodeURIComponent(this.props.ings[i])}`);
        }
        queryParams.push(`price=${this.state.totalPrice}`);
        this.props.history.push({
            pathname: '/checkout',
            search: `?${queryParams.join('&')}`,
        });
    }

    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let modalContent = null;
        let burger = this.state.error ? <p>The application is fucked.</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger
                        ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        canPurchase={this.state.canPurchase}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );

            modalContent = (
                <OrderSummary
                    ingredients={this.props.ings}
                    price={this.state.totalPrice}
                    purchaseCanceled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler} />
            );
        }

        if (this.state.loading) {
            modalContent = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {modalContent}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
