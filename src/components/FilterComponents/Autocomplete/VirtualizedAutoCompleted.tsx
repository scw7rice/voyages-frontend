import React, { useState, useEffect, useMemo, SyntheticEvent } from "react";
import { Autocomplete, TextField, Typography, ListSubheader } from '@mui/material';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    AutoCompleteInitialState,
    AutoCompleteOption,
    DataSuggestedValuesProps,
    Filter,
    RangeSliderState,
} from '@/share/InterfaceTypes';
import {
    setAutoLabel,
    setIsChangeAuto,
} from '@/redux/getAutoCompleteSlice';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { usePageRouter } from '@/hooks/usePageRouter';
import { IRootFilterObject } from '@/share/InterfaceTypes';
import CustomAutoListboxComponent from "./CustomAutoListboxComponent";
import { useAutoComplete } from "@/hooks/useAutoComplete";
import { setFilterObject } from "@/redux/getFilterSlice";

export default function VirtualizedAutoCompleted() {
    const { varName, rangeSliderMinMax: rangeValue } = useSelector(
        (state: RootState) => state.rangeSlider as RangeSliderState
    );
    const { styleName } = usePageRouter()
    const { geoTreeValue } = useSelector(
        (state: RootState) => state.getGeoTreeData
    );

    const limit = 20;
    const { isLoadingList } = useSelector(
        (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
    );
    const { filtersObj } = useSelector((state: RootState) => state.getFilter);

    const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
    const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
    const [autoValue, setAutoValue] = useState<string>('');
    const [offset, setOffset] = useState<number>(0);
    const dispatch: AppDispatch = useDispatch();

    const filters: Filter[] = [];
    if (selectedValue.length > 0) {
        filters.push({
            varName: varName,
            searchTerm: selectedValue.map((item) => item.value),
            op: "in"
        });
    }

    const dataSend: IRootFilterObject = {
        varname: varName,
        querystr: autoValue,
        offset: offset,
        limit: limit,
        filter: filters,
    };
    const { data, isLoading, isError } = useAutoComplete(dataSend, styleName);

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const { suggested_values } = data as DataSuggestedValuesProps;
            const newAutoList: AutoCompleteOption[] = suggested_values.map((value: AutoCompleteOption) => value);
            setAutoLists((prevAutoList) => [...prevAutoList, ...newAutoList]);
        }
    }, [data, isLoading, isError]);

    const refetchAutoComplete = () => {
        setOffset((prevOffset) => prevOffset + 10);
    };

    useEffect(() => {
        if (isLoadingList) {
            refetchAutoComplete();
        }
        const storedValue = localStorage.getItem('filterObject');
        if (!storedValue) return;

        const parsedValue = JSON.parse(storedValue);
        console.log({ parsedValue })
        const filter: Filter[] = parsedValue.filter;
        const filterByVarName = filter?.length > 0 && filter.find((filterItem) => filterItem.varName === varName);
        if (!filterByVarName) return;

        const autoValueList: string[] = filterByVarName.searchTerm as string[];
        const values = autoValueList.map<AutoCompleteOption>((item: string) => ({ value: item }));
        setSelectedValue(() => values);

    }, [isLoadingList, filtersObj, varName, styleName]);

    const handleInputChange = useMemo(
        () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
            event.preventDefault();
            setAutoValue(value);
        },
        []
    );

    const handleAutoCompletedChange = (
        event: SyntheticEvent<Element, Event>,
        newValue: AutoCompleteOption[]
    ) => {
        if (newValue) {
            setSelectedValue(newValue as AutoCompleteOption[]);
            dispatch(setIsChangeAuto(true));
            const autuLabel: string[] = newValue.map((ele) => ele.value);

            dispatch(setAutoLabel(autuLabel));

            // Retrieve existing filterObject from localStorage
            const existingFilterObjectString = localStorage.getItem('filterObject');

            let existingFilterObject: any = {};

            if (existingFilterObjectString) {
                existingFilterObject = JSON.parse(existingFilterObjectString);
            }

            // Retrieve existing filters array
            const existingFilters: Filter[] = existingFilterObject.filter || [];
            const existingFilterIndex = existingFilters.findIndex(filter => filter.varName === varName);

            if (existingFilterIndex !== -1) { //&& existingFilterObjectIndex !== -1
                existingFilters[existingFilterIndex].searchTerm = [...autuLabel];
            } else {
                // If it doesn't exist, create a new filter
                const newFilter: Filter = {
                    varName: varName,
                    searchTerm: autuLabel,
                    op: 'in'
                };
                existingFilters.push(newFilter);
            }

            dispatch(setFilterObject(existingFilters));

            // Update filterObject state
            const filterObjectUpdate = {
                ...geoTreeValue,
                filter: existingFilters
            };

            // Update localStorage
            const filterObjectString = JSON.stringify(filterObjectUpdate);
            localStorage.setItem('filterObject', filterObjectString);

        }
    };
    const renderGroup = (params: any) => [
        <ListSubheader key={params.key} component="div">
            {params.group}
        </ListSubheader>,
        params.children
    ];

    return (
        <Autocomplete
            ListboxComponent={CustomAutoListboxComponent}
            multiple
            id="tags-outlined"
            style={{ width: 400 }}
            options={autoList}
            isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
            }}
            getOptionLabel={(option) => option.value}
            value={selectedValue}
            onChange={handleAutoCompletedChange}
            onInputChange={handleInputChange}
            inputValue={autoValue}
            renderGroup={renderGroup}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={
                        <Typography variant="body1" style={{ fontSize: 16 }}>
                            field
                        </Typography>
                    }
                    placeholder="SelectedOptions"
                    style={{ marginTop: 20 }}
                />
            )}
        />
    );
}
