import React from 'react';

import NewSettingsPop from '../SideBar/NewSettingsPop';

class SettingsPanel extends React.Component {
    state = {
        isKeyModalOpen: false,
    };

    toggleKeyModal = (isKeyModalOpen) => {
        this.setState(prevState => ({
            isKeyModalOpen: (typeof isKeyModalOpen === 'boolean') ? isKeyModalOpen : !prevState.isKeyModalOpen,
        }));
    };

    render() {
        return(
            <NewSettingsPop
                toggleKeyModal={this.toggleKeyModal}
            />
        );
    }
}

export default SettingsPanel;
