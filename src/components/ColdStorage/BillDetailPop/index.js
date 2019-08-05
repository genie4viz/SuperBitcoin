import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import PopUp from '@/components-generic/PopUp';
import { Wrapper } from '@/components-generic/Wrappers';
import { BackgroundImg } from '../styles';
import {
    CONTENT_STYLE,
    LeftDetails,
    LeftQRCodeWrapper,
    LeftAnnotation,
    RightDetails,
    BillInfo,
    RightQRCodeWrapper,
    QRCode
} from './styles';

const BillDetailPop = memo(({ level, publicAddress, publicKey, withdrawAddress, ownerId, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const bgURL = `./img/bills/bill_${level + 1}.png`;
    const qrLink = `demo.bct.trade/publickey/${ownerId}`;

    function handleClose() {
        setIsOpen(false);
        onClose();
    }

    return (
        <PopUp contentStyle={CONTENT_STYLE} open={isOpen} onClose={handleClose}>
            {/* Darwin Background Img */}
            <BackgroundImg src={bgURL} />

            <Wrapper>
                <LeftDetails>
                    {/* Show big QR code containing userId + Withdraw Guide */}
                    <LeftQRCodeWrapper>
                        <LeftAnnotation>PUBLIC KEY & ADDRESS FOR THIS BTCCOIN BILL</LeftAnnotation>
                        <QRCode value={publicAddress} fgColor="#000000A0" />
                    </LeftQRCodeWrapper>
                </LeftDetails>

                <RightDetails>
                    {/* Show Currency value + Date */}
                    <BillInfo>
                        PUBLIC KEY: {publicKey}. REFINED ADDRESS: {withdrawAddress}
                    </BillInfo>

                    {/* Show small QR code containing link to user Private Key */}
                    <RightQRCodeWrapper>
                        <QRCode value={qrLink} />
                    </RightQRCodeWrapper>
                </RightDetails>
            </Wrapper>
        </PopUp>
    );
});

BillDetailPop.propTypes = {
    level: PropTypes.number,
    publicAddress: PropTypes.string,
    publicKey: PropTypes.string,
    withdrawAddress: PropTypes.string,
    ownerId: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

BillDetailPop.defaultProps = {
    level: 0,
    publicAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    publicKey: 'E9873D79C6D87DC0FB6A5778633389F4453213303DA61F20BD67FC233AA33262',
    withdrawAddress: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
    ownerId: '1234567890123456'
};

export default BillDetailPop;
