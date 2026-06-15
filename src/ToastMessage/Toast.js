import React, { useEffect } from 'react';
import styled from 'styled-components';

const ToastMessageMainDivBox = styled.div`
    #Toast_div_success {
        margin-top: 10px;
        background-color: #3344f7;
        padding: 15px 15px;
        color: white;
        font-weight: 400;
        border-radius: 5px;
        box-shadow: 2px 3px 2px 2px lightgrey;
    }
    #Toast_div_fail {
        margin-top: 10px;
        background-color: #a50606;
        padding: 15px 15px;
        color: white;
        font-weight: 400;
        border-radius: 5px;
        box-shadow: 2px 3px 2px 2px lightgrey;
    }
    #toast-container-main > div {
        background-color: rgba(0, 0, 0, 0.15);
        color: white;
        width: 100%;
        margin-bottom: 10px;
        min-height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 12px;
        animation: slide-in 0.2s;
        transition: all 0.3s ease;
    }

    .toast-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    button {
        border: none;
        outline: none;
        color: white;
        background: none;
        font-size: 1.1em;
        font-weight: bolder;
        margin-right: 10px;
        :hover {
            cursor: pointer;
        }
    }

    @keyframes slide-in {
        from {
            transform: translateX(30px);
            opacity: 0;
        }
        to {
            transform: translateX(0px);
            opacity: 1;
        }
    }
`;

const Toast = ({ id, destroy, title, duration, successCheck }) => {
    useEffect(() => {
        if (!duration) return;

        const timer = setTimeout(() => {
            destroy();
        }, duration);

        return () => clearTimeout(timer);
    }, [destroy, duration]);
    return (
        <ToastMessageMainDivBox>
            <div id={successCheck ? 'Toast_div_success' : 'Toast_div_fail'}>
                <div className={'toast-header'}>
                    <div>{title}</div>
                    <button onClick={destroy}>X</button>
                </div>
            </div>
        </ToastMessageMainDivBox>
    );
};
const shouldRerender = (prevProps, nextProps) => {
    return prevProps.id === nextProps.id;
};
export default React.memo(Toast, shouldRerender);
