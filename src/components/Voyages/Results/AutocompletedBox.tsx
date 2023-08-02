import {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  SyntheticEvent,
} from 'react';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAutoComplete } from '@/fetchAPI/voyagesApi/fetchAutoCompleted';
import { Autocomplete, Stack, TextField, Box, Typography } from '@mui/material';

import 'react-dropdown-tree-select/dist/styles.css';
import {
  AutoCompleteInitialState,
  AutoCompleteOption,
  AutocompleteBoxProps,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import {
  setAutoCompleteValue,
  setAutoLabel,
  setIsChangeAuto,
} from '@/redux/getAutoCompleteSlice';
import { fetchPastEnslavedAutoComplete } from '@/fetchAPI/pastEnslavedApi/fetchPastEnslavedAutoCompleted';
import { ALLENSLAVED, ALLENSLAVERS, ALLVOYAGES } from '@/share/CONST_DATA';
import { fetchPastEnslaversAutoCompleted } from '@/fetchAPI/pastEnslaversApi/fetchPastEnslaversAutoCompleted';
import '@/style/Slider.scss';
import '@/style/table.scss';
const AutocompleteBox: FunctionComponent<AutocompleteBoxProps> = (props) => {
  const { varName, rangeSliderMinMax: rangeValue } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );

  const { pathName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const { autoCompleteValue } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const [autoList, setAutoLists] = useState<AutoCompleteOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<AutoCompleteOption[]>([]);
  const [autoValue, setAutoValue] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    const formData: FormData = new FormData();
    formData.append(varName, autoValue);

    if (pathName === ALLVOYAGES) {
      dispatch(fetchAutoComplete(formData))
        .unwrap()
        .then((response: any) => {
          if (response) {
            setAutoLists(response?.results);
          }
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    } else if (pathName === ALLENSLAVED) {
      dispatch(fetchPastEnslavedAutoComplete(formData))
        .unwrap()
        .then((response: any) => {
          if (response) {
            setAutoLists(response?.results);
          }
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    } else if (pathName === ALLENSLAVERS) {
      dispatch(fetchPastEnslaversAutoCompleted(formData))
        .unwrap()
        .then((response: any) => {
          if (response) {
            setAutoLists(response?.results);
          }
        })
        .catch((error: Error) => {
          console.log('error', error);
        });
    }
  }, [dispatch, varName, autoValue, pathName]);

  const handleInputChange = useMemo(
    () => (event: React.SyntheticEvent<Element, Event>, value: string) => {
      event.preventDefault();
      setAutoValue(value);
    },
    []
  );

  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      const { filterObject } = parsedValue;
      for (const autoKey in filterObject) {
        if (varName === autoKey) {
          const autoValueList = filterObject[autoKey];
          setSelectedValue(autoValueList);
        }
      }
    }
  }, []);

  const handleAutuCompletedChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: AutoCompleteOption[]
  ) => {
    setSelectedValue(newValue as AutoCompleteOption[]);
    if (newValue) {
      dispatch(setIsChangeAuto(true));
      const autuLabel: string[] = newValue.map((ele) => ele.label);
      dispatch(
        setAutoCompleteValue({
          ...autoCompleteValue,
          [varName]: newValue,
        })
      );
      dispatch(setAutoLabel(autuLabel));

      const filterObject = {
        filterObject: {
          ...autoCompleteValue,
          ...rangeValue,
          [varName]: newValue,
        },
      };
      const filterObjectString = JSON.stringify(filterObject);
      localStorage.setItem('filterObject', filterObjectString);
    }
  };

  return (
    <Stack spacing={3} className="autocomplete-modal-box">
      <Autocomplete
        multiple
        id="tags-outlined"
        options={autoList}
        isOptionEqualToValue={(option, value) => {
          return option.id === value.id;
        }}
        getOptionLabel={(option) => option.label}
        value={selectedValue}
        onChange={handleAutuCompletedChange}
        onInputChange={handleInputChange}
        inputValue={autoValue}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id} sx={{ fontSize: 16 }}>
            {option.label ? option.label : '--'}
          </Box>
        )}
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
    </Stack>
  );
};

export default AutocompleteBox;
