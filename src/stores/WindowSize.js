import { observable, action } from 'mobx';
import { debounce } from 'lodash';

const handleWindowResize = (onWindowResize) => {
    window.addEventListener(
        'resize',
        debounce(
            onWindowResize, 350
        )
    );
};

class WindowSize {
    @observable width = window.innerWidth;
    @observable height = window.innerHeight;

    constructor() {
        handleWindowResize(this.setDimensions);
    }

    @action.bound
    setDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
}

export default () => {
    const store = new WindowSize();
    return store;
};
