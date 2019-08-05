/* eslint-disable camelcase */
/* eslint-disable react/no-this-in-sfc */
import { observable } from 'mobx';
import moment from 'moment';
import { channelsLinks } from '../utils/telegramChannels';
import COIN_DATA_MAP from '../mock/coin-data-map';

const { to } = require('await-to-js');

const FAIL_SAFE_GROUP = {
    Coin: 'Crypto Currency News',
    Telegram: 'cryptocurrencynewsbct',
};

class TelegramPublicStore {
    @observable activeCoinData = [];
    @observable activeCoin = '';
    @observable lastPost = 0;
    @observable realName = '';
    @observable participantsNum = 0;
    @observable errMsg = '';
    @observable isMtprotoLogin = false;
    @observable isJoinable = false;
    base = '';

    /*
    constructor(instrumentStore, telegramStore, viewModeStore) {
        this.isMtprotoLogin = localStorage.getItem('mtprotosignedin') === 'true';

        reaction(
            () => telegramStore.isMtprotoLogin,
            (isMtprotoLogin) => {
                this.isMtprotoLogin = isMtprotoLogin;

                const defaultTelegram = localStorage.getItem('defaultTelegram') || '';
                if (defaultTelegram === '' || !this.isMtprotoLogin) {
                    this.updatePublicChannel(telegramStore, 'BTC');
                } else {
                    this.updatePublicChannelWithDefaultSetting(telegramStore, defaultTelegram);
                }
            }
        );

        reaction(
            () => viewModeStore.viewMode,
            (viewMode) => {
                const defaultTelegram = localStorage.getItem('defaultTelegram') || '';
                if (viewMode === viewModeKeys.publicChatModeKey && defaultTelegram !== '' && this.isMtprotoLogin) {
                    this.updatePublicChannelWithDefaultSetting(telegramStore, defaultTelegram);
                }
            }
        );

        instrumentStore.instrumentsReaction(
            async (base, quote) => {
                if (base === 'USDT') {
                    this.updatePublicChannel(telegramStore, quote);
                } else {
                    this.updatePublicChannel(telegramStore, base);
                }
            },
            true
        );

        // this.supportChannels = ["BTC", "ETH", "BCH", "LTC"];
        // this.isMtprotoLogin = localStorage.getItem('signedin') === 'true';
        //
        // reaction(
        //     () => telegramStore.isMtprotoLogin,
        //     (isMtprotoLogin) => {
        //         this.isMtprotoLogin = isMtprotoLogin;
        //         this.updatePublicChannel(telegramStore, 'BTC');
        //     }
        // );
        //
        // instrumentStore.instrumentsReaction(
        //     async (base, quote) => {
        //         this.base = base;
        //         if (!demoPageStore.isDemoPageVisible){
        //             this.updatePublicChannel(telegramStore, base);
        //         } else {
        //             this.updatePublicChannel(telegramStore, 'BCT');
        //         }
        //     },
        //     true
        // );
    }
    */

    // Get Chats when user is logged in
    getChannelMessages = async (userName, name, clientWrapper, checkIfSubscribed, setActiveChannel) => {
        if (userName) {
            // --- get channelId, access_hash ---
            const [err, resolvedPeer] = await to(clientWrapper('contacts.resolveUsername', { username: userName }));
            if (err) {
                console.log(err);
                return null;
            }

            if (!resolvedPeer || !resolvedPeer.chats || !resolvedPeer.chats[0]) {
                return null;
            }

            const channelType = resolvedPeer.chats[0]._;
            const channelId = resolvedPeer.chats[0].id;
            const accessHash = resolvedPeer.chats[0].access_hash;
            // console.log("[channelType] : ", channelType,  "[channelId] : ", channelId, "[accessHash] : ", accessHash);

            // --- set activeChannel in TelegramStore ---
            setActiveChannel(channelType, channelId, accessHash, name);

            // --- load message history ---
            if (channelId && accessHash) {
                const [err, history] = await to(clientWrapper('messages.getHistory', {
                    peer: {
                        _: 'inputPeerChannel',
                        channel_id: channelId,
                        access_hash: accessHash,
                    },
                    offset_id: 0,
                    add_offset: 0,
                    limit: 50,
                }));

                if (err) {
                    console.log('    --x-- Can not get chat history', err);
                    return null;
                }

                // check whether channel is joinable.
                this.isJoinable = !checkIfSubscribed(channelId, accessHash);
                return history;
            }
        }

        this.isJoinable = false;

        return null;
    };

    loadChannel(result, base, getParticipants, getUserInfo, getMessageServiceText) {
        const c_messages = result.messages;
        const c_chats = result.chats;
        const c_users = result.users;
        const resultChats = [];

        let c_chat_photo = null;
        let activePeerChatAvailable = false;

        // Check if sending message available
        if (c_chats[0] && c_chats[0]._ && c_chats[0]._ === 'channel') {
            activePeerChatAvailable = !!(c_chats[0].megagroup || c_chats[0].creator);
            c_chat_photo = c_chats[0].photo.photo_small;
        } else {
            activePeerChatAvailable = true;
        }

        // --- extract message data ---
        for (let i = 0; i < c_messages.length; i++) {
            const message_item = c_messages[i];
            const message_type = message_item._; // reply, message or messageService

            const newItem = {};
            switch (message_type) {
            case 'message':
                newItem.type = 'message';
                newItem.text = message_item.message;
                newItem.date = moment(message_item.date * 1000).format('H:mm');
                newItem.user = getUserInfo(c_users, message_item.from_id);
                // Get channel photo for Mute Channels
                if (!activePeerChatAvailable) {
                    newItem.user.avatar = c_chat_photo;
                }
                if (message_item.media) {
                    newItem.media = message_item.media;
                } else {
                    newItem.media = null;
                }

                if (message_item.reply_to_msg_id) { // case 'reply'
                    newItem.type = 'reply';
                    const reply_id = message_item.reply_to_msg_id;
                    newItem.to = {};
                    for (let j = 0; j < c_messages.length; j++) {
                        if (c_messages[j].id === reply_id) {
                            newItem.to.text = c_messages[j].message;
                            newItem.to.user = getUserInfo(c_users, c_messages[j].from_id);
                            break;
                        }
                    }
                }
                break;
            case 'messageService':
                newItem.type = 'extra';
                newItem.date = getMessageServiceText(c_users, c_messages, message_item);
                break;
            default:
                break;
            }
            resultChats.push(newItem);

            if (i === c_messages.length - 1 || !moment(message_item.date * 1000).isSame(moment(c_messages[i + 1].date * 1000), 'day')) {
                // Input date at first
                resultChats.push({
                    type: 'date',
                    date: moment(message_item.date * 1000).format('MMMM D'),
                });
            }
        }

        this.activeCoin = base;
        this.lastPost = Date.now();
        this.realName = c_chats.length > 0 ? c_chats[0].title : '';
        this.errMsg = '';
        this.activeCoinData = resultChats.reverse();

        // --- get participants count from id, access_hash ---
        if (c_chats.length > 0) {
            const id = c_chats[0].id;
            const access_hash = c_chats[0].access_hash;
            getParticipants(id, access_hash).then(fullChat => {
                if (fullChat && fullChat.full_chat) {
                    this.participantsNum = fullChat.full_chat.participants_count;
                }
            });
        }
    }

    isObjectEmpty(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    updatePublicChannel(telegramStore, base) {
        const {
            clientWrapper, getParticipants, getUserInfo, getMessageServiceText, checkIfSubscribed, setActiveChannel,
        } = telegramStore;

        if (!this.isMtprotoLogin || (base.toUpperCase() === 'BTC')) {
            const url = `/services/api/coins/${base.toLowerCase()}`;
            fetch(url)
                .then(async response => {
                    try {
                        const result = await response.json();
                        if (!this.isObjectEmpty(result)) {
                            this.loadChannel(result, base, getParticipants, getUserInfo, getMessageServiceText);
                        } else if (base.toLowerCase() !== 'btc') {
                            this.updatePublicChannel(telegramStore, 'BTC');
                        } else {
                            this.activeCoin = base;
                            this.lastPost = Date.now();
                            this.realName = '';
                            this.activeCoinData = [];
                            this.participantsNum = 0;
                            this.errMsg = 'No channel is connected.';
                        }
                    } catch (e) {
                        if (base.toLowerCase() !== 'btc') {
                            this.updatePublicChannel(telegramStore, 'BTC');
                        } else {
                            this.activeCoin = base;
                            this.lastPost = Date.now();
                            this.realName = '';
                            this.activeCoinData = [];
                            this.participantsNum = 0;
                            this.errMsg = 'No channel is connected.';
                        }
                    }
                });
        } else {
            const coin = base.toUpperCase();
            let userName = '';

            if (channelsLinks[coin] && channelsLinks[coin][0].Telegram !== '') {
                // console.log('[telegramId]', channelsLinks[coin][0].Telegram);
                userName = channelsLinks[coin][0].Telegram;
            } else {
                userName = FAIL_SAFE_GROUP.Telegram;
            }

            const name = COIN_DATA_MAP[coin] ? `${COIN_DATA_MAP[coin].name} Channel` : coin;
            this.getChannelMessages(userName, name, clientWrapper, checkIfSubscribed, setActiveChannel)
                .then((result) => {
                    if (result) {
                        this.loadChannel(result, base, getParticipants, getUserInfo, getMessageServiceText);
                    } else {
                        this.activeCoin = base;
                        this.lastPost = Date.now();
                        this.realName = '';
                        this.activeCoinData = [];
                        this.participantsNum = 0;
                        this.errMsg = 'No channel is connected.';
                    }
                });
        }
    }

    updatePublicChannelWithDefaultSetting(telegramStore, defaultTelegram) {
        console.log('[defaultTelegram]', defaultTelegram);
        const {
            clientWrapper, getParticipants, getUserInfo, getMessageServiceText, checkIfSubscribed, setActiveChannel,
        } = telegramStore;

        this.getChannelMessages(defaultTelegram, defaultTelegram, clientWrapper, checkIfSubscribed, setActiveChannel)
            .then((result) => {
                if (result) {
                    this.loadChannel(result, defaultTelegram, getParticipants, getUserInfo, getMessageServiceText);
                } else {
                    this.activeCoin = defaultTelegram;
                    this.lastPost = Date.now();
                    this.realName = '';
                    this.activeCoinData = [];
                    this.participantsNum = 0;
                    this.errMsg = 'Your Default Channel is Not Available';
                }
            });
    }
}

export default (instrumentStore, telegramStore, viewModeStore) => {
    const store = new TelegramPublicStore(instrumentStore, telegramStore, viewModeStore);
    return store;
};
