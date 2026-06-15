import storage from 'redux-persist/lib/storage';

export const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['Login_Info_Reducer_State'],
};
