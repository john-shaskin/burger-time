import React from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Auxilliary/Auxilliary';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => {
    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0) translateX(0)' : 'translateY(-100vh) translateX(-100vw)',
                    opacity: props.show ? '1' : '0',
                }}>
                {props.children}
            </div>
        </Aux>
    );
}

export default React.memo(
    modal,
    (prevProps, nextProps) => {
        return nextProps.show === prevProps.show && nextProps.children === prevProps.children;
    });
