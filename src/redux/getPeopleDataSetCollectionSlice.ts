import { BaseFilter, InitialStateDataPeopleSetCollection } from '@/share/InterfactTypesDatasetCollection';
import jsonDataPEOPLECOLLECTIONS from '@/utils/flatfiles/PEOPLE_COLLECTIONS.json'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const initialState: InitialStateDataPeopleSetCollection = {
    value: jsonDataPEOPLECOLLECTIONS,
    textHeader: jsonDataPEOPLECOLLECTIONS[0].headers.label,
    textIntroduce: jsonDataPEOPLECOLLECTIONS[0].headers.text_introduce,
    styleNamePeople: jsonDataPEOPLECOLLECTIONS[0].style_name,
    dataSetValueBaseFilter: [],
    dataSetKeyPeople: '',
    dataSetValuePeople: [],
    blocksPeople: jsonDataPEOPLECOLLECTIONS[0].blocks,
    filterMenuFlatfile: jsonDataPEOPLECOLLECTIONS[0].filter_menu_flatfile,
    tableFlatfile: jsonDataPEOPLECOLLECTIONS[0].table_flatfile
}

export const getPeopleDataSetCollectionSlice = createSlice({
    name: 'getPeopleDataSetCollectionSlice',
    initialState,
    reducers: {
        setBaseFilterPeopleDataSetValue: (state, action: PayloadAction<BaseFilter[]>) => {
            state.dataSetValueBaseFilter = action.payload;
        },
        setBaseFilterPeopleDataKey: (state, action: PayloadAction<string>) => {
            state.dataSetKeyPeople = action.payload;
        },
        setBaseFilterPeopleDataValue: (state, action: PayloadAction<string[] | number[]>) => {
            state.dataSetValuePeople = action.payload;
        },
        setDataSetPeopleHeader: (state, action: PayloadAction<string>) => {
            state.textHeader = action.payload
        },
        setPeopleTextIntro: (state, action: PayloadAction<string>) => {
            state.textIntroduce = action.payload
        },
        setPeopleStyleName: (state, action: PayloadAction<string>) => {
            state.styleNamePeople = action.payload
        },
        setPeopleBlocksMenuList: (state, action: PayloadAction<string[]>) => {
            state.blocksPeople = action.payload
        },
        setPeopleFilterMenuFlatfile: (state, action: PayloadAction<string>) => {
            state.filterMenuFlatfile = action.payload
        },
        setPeopleTableFlatfile: (state, action: PayloadAction<string>) => {
            state.tableFlatfile = action.payload
        },
    },
});

export const { setBaseFilterPeopleDataSetValue,
    setBaseFilterPeopleDataKey, setBaseFilterPeopleDataValue, setPeopleFilterMenuFlatfile, setPeopleTableFlatfile,
    setDataSetPeopleHeader, setPeopleTextIntro, setPeopleStyleName, setPeopleBlocksMenuList } = getPeopleDataSetCollectionSlice.actions;

export default getPeopleDataSetCollectionSlice.reducer;