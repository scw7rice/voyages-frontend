import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { InitialStateTransatlanticCard, TransatlanticCardProps } from '@/share/InterfaceTypes';
const initialState: InitialStateTransatlanticCard = {
    cardData: [],
    isModalCard: false,
    cardRowID: 0,
    cardFileName: '',
    cardDataArray: [],
    nodeType: ''
};
export const getCardFlatObjectSlice = createSlice({
    name: 'getCardFlatObject',
    initialState,
    reducers: {
        setCardData: (state, action: PayloadAction<Record<string, any>[]>) => {
            state.cardData = action.payload;
        },
        setIsModalCard: (state, action: PayloadAction<boolean>) => {
            state.isModalCard = action.payload;
        },
        setCardRowID: (state, action: PayloadAction<number>) => {
            state.cardRowID = action.payload;
        },
        setCardFileName: (state, action: PayloadAction<string>) => {
            state.cardFileName = action.payload;
        },
        setCardDataArray: (state, action: PayloadAction<TransatlanticCardProps[]>) => {
            state.cardDataArray = action.payload;
        },
        setNodeClass: (state, action: PayloadAction<string>) => {
            state.nodeType = action.payload;
        },
    }
})

export const { setCardData, setIsModalCard, setCardRowID, setCardFileName, setCardDataArray, setNodeClass } = getCardFlatObjectSlice.actions;
export default getCardFlatObjectSlice.reducer;