import * as types from './types';

const rows = [];
const initialDeliveryPersonState = {
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
	rows: rows,
	deliveryPerson: initialDeliveryPersonState,
	customer: initialCustomerState,
	editIndex: 0,
	tableLoading: false,
	error: null,
}; // Combined initial state	

// delivery personnel table data transformation
const rowTransFormation = (data) => {
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

const singleTransFormation = (data) => {
	const transformedData = {
		id: data.delivery_personnel_info.id ?? '',
		firstname: data.delivery_personnel_info.firstname ?? '',
		middlename: data.delivery_personnel_info.middlename ?? '',
		lastname: data.delivery_personnel_info.lastname ?? '',
		primaryID_id: data.delivery_personnel_info.primaryID_id ?? '',
		primary_id_img: data.delivery_personnel_info.primary_id_img ?? '',
		primary_id_img_name: data.delivery_personnel_info.primary_id_img_name ?? '',
		secondaryID_id: data.delivery_personnel_info.secondaryID_id ?? '',
		secondary_id_img: data.delivery_personnel_info.secondary_id_img ?? '',
		secondary_id_img_name: data.delivery_personnel_info.secondary_id_img_name ?? '',
		contact_number: data.delivery_personnel_info.contact_number ?? '',
		email_address: data.delivery_personnel_info.email_address ?? '',
		home_address: data.delivery_personnel_info.home_address ?? '',
	};
	
	return transformedData;
}

const productDeliveryReducer = (state = initialState, action) => {
	switch (action.type) {
		case types.REQUEST_FETCH_START:
			return {
				...state,
				tableLoading: true,
				error: null,
			};
		case types.REQUEST_FETCH_SUCCESS:
			const data = action.payload.data;
			if (data.hasOwnProperty('delivery_persons')) {
				const transformedData = rowTransFormation(data);
				return {
					...state,
					[action.payload.module]: {
						...state[action.payload.module],
					},
					rows: transformedData,
					tableLoading: false,
					error: null,
				};
			} else if (data.hasOwnProperty('delivery_personnel_info')) {
				const transformedData = singleTransFormation(data);
				return {
					...state,
					[action.payload.module]: {
						...state[action.payload.module],
						...transformedData
					},
					tableLoading: false,
					error: null
				}
			}
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
				...state,
				editIndex: action.payload.editIndexVal
			};
		case types.UPDATE_FORM:
			if (action.payload.module === 'deliveryPerson') {
				// Merge the new form data with the existing deliveryPerson state
				const updatedDeliveryPerson = {
				...state.deliveryPerson,
				[action.payload.fieldName]: action.payload.fieldValue,
				};
		
				return {
				...state,
				deliveryPerson: updatedDeliveryPerson,
				};
			}
			// Handle other modules or return state if no match
			return state;
		// case types.UPDATE_FORM:
		// 	if (action.payload.module === 'deliveryPerson') {
		// 		const updatedDeliveryPerson = { ...state[action.payload.module] }
		// 		console.log(updatedDeliveryPerson, 'TEST_HERE...');

		// 		if (action.payload.fieldName === 'primary_id_img' || action.payload.fieldName === 'secondary_id_img') {
		// 			updatedDeliveryPerson[action.payload.fieldName] = { ...state[action.payload.module][action.payload.fieldName], ...action.payload.fieldValue }
		// 		} else {
		// 			updatedDeliveryPerson[action.payload.fieldName] = action.payload.fieldValue;
		// 		}

		// 		return {
		// 			...state,
		// 			[action.payload.module]: updatedDeliveryPerson
		// 		};
		// 	}
		// 	return state;
		case types.REQUEST_RESET:
			// Create a copy of the initial state for each module
			const resetDeliveryPersonState = { ...initialDeliveryPersonState };
			const resetCustomerState = { ...initialCustomerState };
	  
			return {
				...state,
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