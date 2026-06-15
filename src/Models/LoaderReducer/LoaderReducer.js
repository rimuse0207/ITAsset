export const NOW_LOADER_INFO_START_STATE = 'NOW_LOADER_INFO_START_STATE';
export const NOW_LOADER_INFO_INITIAL_STATE = 'NOW_LOADER_INFO_INITIAL_STATE';

const initState = {
    Loader_Info: {
        Loader: false,
    },
};

export const Now_Loader_Info = () => ({
    type: NOW_LOADER_INFO_START_STATE,
});
export const Now_Loader_Info_Initial = () => ({
    type: NOW_LOADER_INFO_INITIAL_STATE,
});

const Now_Loader_Info_State = (state = initState, action) => {
    switch (action.type) {
        case NOW_LOADER_INFO_START_STATE:
            return {
                ...state,
                Loader_Info: {
                    Loader: true,
                },
            };
        case NOW_LOADER_INFO_INITIAL_STATE:
            return initState;
        default:
            return state;
    }
};

export default Now_Loader_Info_State;
