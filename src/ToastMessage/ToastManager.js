import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import Toast, { ToastDataPropsType } from './Toast';
const root = createRoot(document.getElementById('Toast'));
export class ToastManager {
    containerRef;
    toasts = [];

    constructor() {
        const body = document.getElementsByTagName('body')[0];
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container-main';
        body.insertAdjacentElement('beforeend', toastContainer);
        this.containerRef = toastContainer;
    }

    show(options) {
        const toastId = Math.random().toString(36).substr(2, 9);
        const toast = {
            id: toastId,
            ...options, // if id is passed within options, it will overwrite the auto-generated one
            destroy: () => this.destroy(options.id ?? toastId),
        };

        this.toasts = [toast, ...this.toasts];
        this.render();
    }

    destroy(id) {
        this.toasts = this.toasts.filter(toast => toast.id !== id);
        this.render();
    }

    render() {
        const toastsList = this.toasts.map(toastProps => <Toast key={toastProps.id} {...toastProps} />);
        // root.render(toastsList, this.containerRef);
        root.render(<>{toastsList}</>);
    }
}

export const toast = new ToastManager();
