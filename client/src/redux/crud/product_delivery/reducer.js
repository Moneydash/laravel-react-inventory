import * as types from './types';
import * as formTypes from './formTypes';

const initialDeliveryPersonState = {
	rows: [],
	id: '',
	firstname: '',
	middlename: '',
	lastname: '',
	primaryID_id: '',
	primary_id_img: '',
	primary_id_img_name: '',
	secondaryID_id: '',
	secondary_id_img: '',
	secondary_id_img_name: '',
	contact_number: '',
	email_address: '',
	home_address: '',
}; // Initial formData for delivery persons

const initialCustomerState = {
	rows: [],
	id: '',
	customer_img: '',
	firstname: '',
	middlename: '',
	lastname: '',
	contact_number: '',
	email: '',
	customer_payment_status: 0,
	customer_payment_amnt: '',
	customer_location: '',
}; // Initial formData for customers

const initialState = {
  deliveryPerson: initialDeliveryPersonState,
  customer: initialCustomerState,
  editIndex: 0,
  tableLoading: false,
  error: null,
}; // Combined initial state	

// delivery personnel table data transformation
const DeliveryPersontransformData = (data) => {
	const transformedData = data.delivery_persons.map(delivery_person => {
		return {
			id: delivery_person['id'],
			firstname: delivery_person['firstname'],
			lastname: delivery_person['lastname'],
			contact_number: delivery_person['contact_number'],
			email: delivery_person['email_address'],
			primary_id: delivery_person['primary_id']['id_name_abbr'],
			secondary_id: delivery_person['secondary_id']['id_name_abbr'] === null ? 'None' : delivery_person['secondary_id']['id_name_abbr']
		};
	});
	return transformedData;
};

const productDeliveryReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.REQUEST_FETCH_START:
			return {
				...state,
				tableLoading: true,
				error: null,
			};
		case types.REQUEST_FETCH_SUCCESS:
			const transformedData = DeliveryPersontransformData(action.payload.data);
			return {
				...state,
				[action.payload.module]: {
					...state[action.payload.module],
					rows: transformedData
				},
				tableLoading: false,
				error: null,
			};
		case types.REQUEST_FETCH_ERROR:
				return {
					...state,
					[action.payload.module]: {
						...state[action.payload.module],
						rows: []
					},
					tableLoading: false,
					error: action.payload.error
				};
		case types.REQUEST_UPDATE:
			return {
				editIndex: 1
			};
		case types.UPDATE_FORM:
			if (action.payload.module === 'deliveryPerson') {
				const updatedDeliveryPerson = { ...state[action.payload.module] }
				console.log(updatedDeliveryPerson, 'TEST_HERE...');

				if (action.payload.fieldName === 'primary_id_img' || action.payload.fieldName === 'secondary_id_img') {
					updatedDeliveryPerson[action.payload.fieldName] = { ...state[action.payload.module][action.payload.fieldName], ...action.payload.fieldValue }
				} else {
					updatedDeliveryPerson[action.payload.fieldName] = action.payload.fieldValue;
				}

				return {
					...state,
					[action.payload.module]: updatedDeliveryPerson
				};
			}
		case types.REQUEST_RESET:
			// Create a copy of the initial state for each module
			const resetDeliveryPersonState = { ...initialDeliveryPersonState };
			const resetCustomerState = { ...initialCustomerState };
	  
			return {
				deliveryPerson: resetDeliveryPersonState,
				customer: resetCustomerState,
				editIndex: 0,
				tableLoading: false
			};
		default:
			return state;
	};
};

export default productDeliveryReducer;