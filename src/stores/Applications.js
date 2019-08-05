import { observable, action } from 'mobx';

class Applications {
    @observable applications = {};

    @action
    setInstanceId(appId, instanceId) {
        this.applications = {
            ...this.applications,
            [appId]: instanceId,
        };
    }
}

export default () => {
    return new Applications();
};