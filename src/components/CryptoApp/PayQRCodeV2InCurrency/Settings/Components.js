import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0 0 5rem 0;
`;

export const SettingHeader = styled.div`
    height: 80px;
    display: flex;
    align-items: center;
    font-weight: 600;
    font-family: 'Exo 2',sans-serif;
    padding: 15px 10px 10px 10px;
    border-bottom: 0.5px solid white;
    background-color: #3269D1;

    img {
        height: 40px;
        width: auto;
    }

    p {
        font-size: 24px;
        color: white;
        margin: 0 0 0 10px;
    }
`;

export const SettingItem = styled.div`
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-family: 'Exo 2',sans-serif;
    border-bottom: 0.5px solid white;

    p {
        font-size: 20px;
        color: white;
        margin: 0;
    }

    span {
        font-size: 16px;
        color: #999;

        button {
            i {
                margin-right: 1rem !important;
            }
        }
    }

    .name-input {
        outline: none;
        width: 100%;
        color: white;
        border: none;
        font-size: 20px;
        text-align: center;
        caret-color: white;
        background: transparent;
    }

    .logout-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
            width: 40px;
            margin-right: 10px;
        }
    }
`;

export const OptionTransfer = styled.div`
    width: 44px;
    margin-bottom: 0.5rem;

    input[type="checkbox"].ios8-switch {
        position: absolute;
        margin: 8px 0 0 16px;    
    }
    input[type="checkbox"].ios8-switch + label {
        position: relative;
        padding: 5px 0 0 50px;
        line-height: 2.0em;
    }
    input[type="checkbox"].ios8-switch + label:before {
        content: "";
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 40px; /* x*5 */
        height: 24px; /* x*3 */
        border-radius: 16px; /* x*2 */
        background: #999;
        border: 1px solid transparent;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    input[type="checkbox"].ios8-switch + label:after {
        content: "";
        position: absolute;
        display: block;
        left: 0px;
        top: 0px;
        width: 24px; /* x*3 */
        height: 24px; /* x*3 */
        border-radius: 16px; /* x*2 */
        background: #fff;
        border: 1px solid white;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    input[type="checkbox"].ios8-switch + label:hover:after {
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
    }
    input[type="checkbox"].ios8-switch:checked + label:after {
        margin-left: 16px;
    }
    input[type="checkbox"].ios8-switch:checked + label:before {
        background: #3269D1;
    }
    
    input[type="checkbox"].ios8-switch-sm {
        margin: 5px 0 0 10px;
    }
    input[type="checkbox"].ios8-switch-sm + label {
        position: relative;
        padding: 0 0 0 32px;
        line-height: 1.3em;
    }
    input[type="checkbox"].ios8-switch-sm + label:before {
        width: 44px;
        height: 22px;
        border-radius: 10px;
    }
    input[type="checkbox"].ios8-switch-sm + label:after {
        width: 16px;
        height: 16px;
        border-radius: 20px;
        margin-left: 3px;
        margin-top: 3px;
    }
    input[type="checkbox"].ios8-switch-sm + label:hover:after {
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
    }
    input[type="checkbox"].ios8-switch-sm:checked + label:after {
        margin-left: 24px;
        margin-top: 3px;
    } 
`;

export const AddPhoto = styled.div`
    width: 58px;
    height: 58px;
    border-radius: 50%;
    color: #999;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Exo 2',sans-serif;
    // box-shadow: 0 0 9.07px rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-image: url('/img/user.jpeg');
    background-repeat: round;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
`;

export const ContentWrapper = styled.div`
    flex: 1 1 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    margin: 0;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
`;

export const ImageWrapper = styled.div.attrs({ className: 'avatar-image-wrapper' })`
    width: 33px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.palette.clrBorder};
`;

export const AvatarWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 33px;
    border-radius: 50%;
    background-image: url("/img/default-avatar.png");
    background-size: contain;
    overflow: hidden;
    z-index: 2;
    
    .user-pic {
        z-index: 2;
        width: 33px;
        height: 33px;
    }
`;

export const DefaultAvatar = styled.div`
    position: absolute;
    width: 33px;
    height: 33px;
    background: ${props => props.color};
    color: #fff;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    min-width: 33px;
    min-height: 33px;
    margin: 0 0 5px;
    z-index: 1;
`;

export const InnerWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    background-color: black;
    // border: solid 1.69px white;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
`;
