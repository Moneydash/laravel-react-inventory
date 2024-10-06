import { AddOutlined, CancelOutlined, InventoryOutlined, LocalShippingOutlined, RefreshOutlined, RemoveOutlined } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fab,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { axios_get_header, axios_patch_header, axios_post_header } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import {
    get_Item_deliveries,
    update_Delivery_status,
    generate_Batch_num,
    generate_Delivery_po,
    deliver_Items,
    get_Products_only,
    get_Product_price,
    get_Paid_customers,
    get_Delivery_persons_list
} from 'utils/services';
import { TruckDeliveryIcon } from "hugeicons-react";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { PrimaryColorBtn, PrimaryColorIconBtn } from "components/elements/ButtonsComponent";
import { crumbsHelper } from "utils/helper";
import { toast } from "react-toastify";
import useDebounce from "hooks/useDebounce";
import TableComponentV2 from "components/elements/Tables/TableComponentV2";

function ItemDelivery() {
    document.title = 'InventoryIQ: Delivery Hub - Product Delivery';
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const renderActionButtons = (params) => {
        return <>
            <PrimaryColorIconBtn
                fn={() => update_delivery_status(1, params.value)}
                title="Pickup Item"
                icon={<LocalShippingOutlined fontSize="small" />}
                disabled={params.row.delivery_status === 1 || params.row.delivery_status === 2}
            />
            {
                params.row.delivery_status === 1 || params.row.delivery_status === 2 ? (
                    <PrimaryColorIconBtn
                        fn={() => update_delivery_status(2, params.value)}
                        title="Set as Delivered"
                        icon={<InventoryOutlined fontSize="small" />}
                        sx={{ ml: 1 }}
                        disabled={params.row.delivery_status === 2}
                    />
                ) : ''
            }
        </>
    };

    const columns = [
        { field: 'po_number', headerName: 'PO Number', flex: 1 },
        {
            field: 'batch',
            headerName: 'Batch Number',
            flex: 1,
            valueGetter: (params) => params.row.batches.batch_num
        },
        {
            field: 'product',
            headerName: 'Product Name',
            flex: 1,
            valueGetter: (params) => params.row.products.name
        },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'price', headerName: 'Product Price', flex: 1 },
        {
            field: 'customer',
            headerName: 'Customer',
            flex: 1,
            valueGetter: (params) => `${params.row.customers.firstname} ${params.row.customers.lastname}`
        },
        { field: 'subtotal', headerName: 'Subtotal', flex: 1 },
        {
            field: 'delivery_status',
            headerName: 'Delivery Status',
            flex: 1,
            valueGetter: (params) => params.row.delivery_status === 0
            ? 'For Pickup'
            : (params.row.delivery_status === 1
                ? 'On the way'
                : 'Delivered'
            )
        },
        { field: 'id', headerName: 'Actions', renderCell: renderActionButtons, flex: 1 }
    ];
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [submitDialog, setSubmitDialog] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const initialDeliveries = {
        po_number: '',
        product_id: '',
        price: '',
        quantity: '',
        subtotal: '',
        customer_id: ''
    };
    const initialErrorDeliveries = {
        po_number: false,
        product_id: false,
        price: false,
        quantity: false,
        customer_id: false
    };
    const initialTextHelperDeliveries = {
        po_number: false,
        product_id: false,
        price: false,
        quantity: false,
        customer_id: false
    };
    const [batchNumber, setBatchNumber] = useState('');
    const [deliveryPersonId, setDeliveryPersonId] = useState('');
    const [deliveryPersons, setDeliveryPersons] = useState([]);
    const [itemDeliveries, setItemDeliveries] = useState([initialDeliveries]);
    const [errorItemDeliveries, setErrorItemDeliveries] = useState([initialErrorDeliveries]);
    const [textHelperItemDeliveries, setTextHelperItemDeliveries] = useState([initialTextHelperDeliveries]);

    /* eslint-disable */
    const [forceRender, setForceRender] = useState(false); // Initialize a state variable
    /* eslint-disable */
    
    const [productsLength, setProductsLength] = useState(0);
    const [customerLength, setCustomerLength] = useState(0);
    const [deliveryPersonLen, setDeliveryPersonLen] = useState(0);

    // table data tracking
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);

    const get_delivery_items = async () => {
        // reset table state
        setCurrentPage(1);
        setRowsPerPage(10);
        setSearch('');
        
        setTableLoading(true);
        await axios_get_header(
            `${get_Item_deliveries}?page=1&per_page=10&search=`,
            decrypt_access_token
        )
        .then(response => {
            setTableLoading(false);
            const data = response.data;
            const items = data?.data;
            setMaxPage(data?.last_page);
            setRows(items);
        })
        .catch(error => {
            setTableLoading(false);
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    };
    
    const get_products = useCallback(async () => {
        setTableLoading(true);
        await axios_get_header(get_Products_only, decrypt_access_token)
        .then(response => {
            setTableLoading(false);
            const data = response.data;
            setProductsLength(data.products.length);
            if (data.products.length > 0) {
                setProducts(data.products);   
            }
        })
        .catch(error => {
            setTableLoading(false);
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    }, [decrypt_access_token]);
    
    const get_delivery_persons = useCallback(async () => {
        axios_get_header(get_Delivery_persons_list, decrypt_access_token)
        .then(response => {
            const data = response.data;
            const personnels = data?.delivery_persons;
            setDeliveryPersonLen(data?.delivery_persons?.length);
            if (personnels?.length) {
                setDeliveryPersons(personnels);
            }
        })
        .catch(error => {
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    }, [decrypt_access_token]);
    
    const get_customers = useCallback(async () => {
        await axios_get_header(get_Paid_customers, decrypt_access_token)
        .then(response => {
            const data = response?.data;
            const customers = data?.customers;
            if (customers.hasOwnProperty('customers')) {
                setCustomerLength(customers?.customers.length);
                if (customers?.customers?.length > 0) {
                    setCustomers(customers.customers);
                }
            } else {
                setCustomerLength(customers?.length);
                setCustomers(customers);
            }
        })
        .catch(error => {
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    }, [decrypt_access_token]);

    /* eslint-disable */
    useEffect(() => {
        // Set loading state to true before making the request
        setTableLoading(true);
    
        axios_get_header(
            `${get_Item_deliveries}?page=${currentPage}&per_page=${rowsPerPage}&search=${debounceSearch}`,
            decrypt_access_token
        )
        .then(response => {
            const data = response.data;
            const items = data?.data;
            setMaxPage(data?.last_page);
            setRows(items);
        })
        .catch(error => {
            console.log(error);
            toast.error(try_again);
            throw error;
        })
        .finally(() => {
            // Set loading state to false after the request is complete
            setTableLoading(false);
        });
    }, [currentPage, rowsPerPage, debounceSearch, decrypt_access_token]);
    
    // Fetch products, customers, and delivery persons only once when the component mounts
    useEffect(() => {
        get_products();
        get_customers(); 
        get_delivery_persons();
    }, [get_customers, get_products, get_delivery_persons]);
    /* eslint-disable */

    const generate_batch_number = async () => {
        await axios_get_header(generate_Batch_num, decrypt_access_token)
        .then(response => {
            const data = response.data;
            setBatchNumber(data.batch_number);
        })
        .catch(error => {
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    };

    const generate_po_number = async () => {
        try {
            const response = await axios_get_header(generate_Delivery_po, decrypt_access_token);
            const data = response.data;
            return data.delivery_po_number;
        } catch (error) {
            console.log(error);
            toast.error(try_again);
            return '';
        }
    };

    const get_product_price = async (product_id) => {
        try {
            const response = await axios_get_header(get_Product_price + product_id, decrypt_access_token);
            const data = response.data;
            return data.price;
        } catch (error) {
            console.log(error);
            toast.error(try_again);
            return '';
        }
    };

    const handleAddMore = async () => {
        // generate new po number for every item deliveries
        const poNumber = await generate_po_number();

        if (poNumber !== '') {
            const newItemDelivery = { ...initialDeliveries, po_number: poNumber };
            const newErrorItemDelivery = { ...initialErrorDeliveries };
            const newTextHelperItemDelivery = { ...initialTextHelperDeliveries };
            setItemDeliveries([ ...itemDeliveries, newItemDelivery ]);
            setErrorItemDeliveries([ ...errorItemDeliveries, newErrorItemDelivery ]);
            setTextHelperItemDeliveries([ ...textHelperItemDeliveries, newTextHelperItemDelivery ]);
        } else {
            console.log('Error generating PO Number');
        }
    };

    const handleSubtract = () => {
        if (itemDeliveries.length > 1) {
            const newDeliveries = itemDeliveries.slice(0, -1);
            const newErrorDeliveries = errorItemDeliveries.slice(0, -1);
            const newTextHelperDeliveries = textHelperItemDeliveries.slice(0, -1);
            setItemDeliveries(newDeliveries);
            setErrorItemDeliveries(newErrorDeliveries);
            setTextHelperItemDeliveries(newTextHelperDeliveries);
        } else {
            toast.error('You can\'t remove the last item!');
        }
    };

    const handleDialog = async (status) => {
        // check if there are available products
        if (productsLength > 0) {
            // check if there are registered customers
            if (customerLength > 0) {
                // check if there are available delivery personnel
                if (deliveryPersonLen > 0) {
                    setDialog(status);
                    if (status === true) {
                        get_products();
                        get_customers();
                        generate_batch_number();
            
                        // PO number generation
                        const poNumber = await generate_po_number();
            
                        if (poNumber !== null) {
                            const updatedFirstItem = { ...itemDeliveries[0], po_number: poNumber };
                            // Create a new array with the updated first item and all other items unchanged
                            setItemDeliveries([updatedFirstItem, ...itemDeliveries.slice(1)]);
                        } else {
                            console.log('Error generating PO Number');
                        }
                    } else {
                        setItemDeliveries([initialDeliveries]);
                        setBatchNumber('');
                        setDeliveryPersonId('');
                        get_delivery_items();
                    }
                } else {
                    toast.error('No available Delivery Personnel, please try again later.');
                }
            } else {
                toast.error('You don\'t have any cleared or registered customers.');
            }
        } else {
            toast.error('You don\'t have any products to deliver yet.');
        }
    };

    const handleFieldChange = async (index, field, value) => {
        const newDeliveries = [...itemDeliveries];
        const errorDeliveries = [...errorItemDeliveries];
        const textHelperDeliveries = [...textHelperItemDeliveries];
        if (field === 'quantity') {
            // update the item deliveries with the new value
            newDeliveries[index][field] = parseInt(value);
            setItemDeliveries(newDeliveries);
            const isValidNumber = /^[1-9][0-9]*$/;

            if (isValidNumber.test(value)) {
                const numericValue = parseInt(value);

                if (isNaN(numericValue) || numericValue === '' || numericValue <= 0) {
                    errorDeliveries[index][field] = true;
                    textHelperDeliveries[index][field] = 'Please provide a valid quantity, it cannot be empty or zero.';
                    
                    setErrorItemDeliveries(errorDeliveries);
                    setTextHelperItemDeliveries(textHelperDeliveries);
                } else {
                    errorDeliveries[index][field] = false;
                    textHelperDeliveries[index][field] = '';
                    setErrorItemDeliveries(errorDeliveries);
                    setTextHelperItemDeliveries(textHelperDeliveries);

                    if (newDeliveries[index]['price']) {
                        newDeliveries[index]['subtotal'] = value * newDeliveries[index]['price'];
                        setItemDeliveries(newDeliveries);
                    }
                }
            } else {
                errorDeliveries[index][field] = true;
                textHelperDeliveries[index][field] = 'Quantity must be a number and positive value only.';
                
                setErrorItemDeliveries(errorDeliveries);
                setTextHelperItemDeliveries(textHelperDeliveries);
            }
        }

        if (field === 'product_id') {
            newDeliveries[index][field] = value;
            setItemDeliveries(newDeliveries);
            if (value !== '') {
                try {
                    // Check for duplicate product
                    const duplicateProduct = newDeliveries.some((item, i) => i !== index && item.product_id === value && item.customer_id === newDeliveries[index].customer_id);
                    if (duplicateProduct) {
                        toast.error('You\'ve already added this product for this customer, please choose another product.');
                        
                        // update error state
                        errorDeliveries[index][field] = true;
                        textHelperDeliveries[index][field] = 'Duplicate Product.';
                        setErrorItemDeliveries(errorDeliveries);
                        setTextHelperItemDeliveries(textHelperDeliveries);
                    } else {
                        // update error state
                        errorDeliveries[index][field] = false;
                        textHelperDeliveries[index][field] = '';
                        setErrorItemDeliveries(errorDeliveries);
                        setTextHelperItemDeliveries(textHelperDeliveries);

                        // update price state
                        const price = await get_product_price(value);
                        newDeliveries[index]['price'] = price;
                        setItemDeliveries(newDeliveries);
                        setForceRender(prev => !prev);

                        if (newDeliveries[index]['quantity']) {
                            newDeliveries[index]['subtotal'] = newDeliveries[index]['quantity'] * newDeliveries[index]['price'];
                        }
                    }
                } catch (error) {
                    console.error('Error fetching price: ', error);
                }
            }
        }

        if (field === 'customer_id') {
            newDeliveries[index][field] = value;
            setItemDeliveries(newDeliveries);

            if (value !== '') {
                const duplicateProduct = newDeliveries.some((item, i) => i !== index && item.customer_id === value && item.product_id === newDeliveries[index].product_id);
                if (duplicateProduct) {
                    toast.error('Duplicate Product detected with the same customer, please choose another product.');

                    // update error state
                    errorDeliveries[index]['product_id'] = true;
                    textHelperDeliveries[index]['product_id'] = 'Duplicate Product.';
                    setErrorItemDeliveries(errorDeliveries);
                    setTextHelperItemDeliveries(textHelperDeliveries);
                } else {
                    // update error state
                    errorDeliveries[index]['product_id'] = false;
                    textHelperDeliveries[index]['product_id'] = '';
                        
                    setErrorItemDeliveries(errorDeliveries);
                    setTextHelperItemDeliveries(textHelperDeliveries);
                }
            }
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setDeliveryPersonId(value);
    }

    const handlePreSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        for (const items of itemDeliveries) {
            for (const field in items) {
                if (items[field] === '') {
                    hasError = true;
                    break;
                }
            }
            if (hasError) {
                break;
            }
        }

        if (hasError) {
            toast.error('Please check any empty or incorrect fields.');
        } else {
            setSubmitDialog(true);
            get_delivery_persons();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            items: itemDeliveries,
            batch_number: batchNumber,
            delivery_person: deliveryPersonId
        };

        axios_post_header(deliver_Items, data, decrypt_access_token)
        .then(response => {
            const data = response.data;
            toast.success(data?.message);
            handleDialog(false);
            setSubmitDialog(false);
        })
        .catch(error => {
            toast.error(try_again);
            console.log(error);
        });
    };

    const update_delivery_status = async (status, delivery_id) => {
        await axios_patch_header(`${update_Delivery_status}${status}/${delivery_id}`, {}, decrypt_access_token)
        .then(response => {
            toast.success(response?.data?.message);
            get_delivery_items();
        })
        .catch(error => {
            console.log(error);
            toast.error(try_again);
            throw error;
        });
    };

    return (
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">
            {/* dialog for confirmation and choosing the delivery personnel */}
            <Dialog open={submitDialog} fullWidth maxWidth="sm">
                <DialogTitle>Delivery Confirmation</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">You are now submitting your for delivery items. Are you sure on those delivery items? If yes, you can proceed to select your delivery personnel below.</Typography>
                    <FormControl fullWidth sx={{ mt: 3 }}>
                        <InputLabel id="delivery_person_id">Delivery Personnel</InputLabel>
                        <Select
                            labelId="delivery_person_id"
                            id="delivery_person_id"
                            label="Delivery Personnel"
                            value={deliveryPersonId}
                            name="delivery_person_id"
                            onChange={handleChange}
                        >
                            {deliveryPersons.map(delivery_person => (
                                <MenuItem key={delivery_person.id} value={delivery_person.id}>
                                    { delivery_person.firstname + ' ' + delivery_person.lastname }
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined />} onClick={() => setSubmitDialog(false)}>No, I'm not sure</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" endIcon={<TruckDeliveryIcon size={18} />} onClick={handleSubmit}>Proceed</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* dialog for adding delivery items */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>Item Delivery - {batchNumber}</DialogTitle>
                <Divider />
                <DialogContent>
                    { itemDeliveries.map((itemDelivery, index) => (
                        <Grid container direction="row" rowSpacing={2} key={index} sx={{ mb: 2, borderTop: index !== 0 ? '1px solid #ccc' : '', pb: 2 }}>
                            <Grid container item direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2, xs: 2 }}>
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
                                    <TextField
                                        label="PO Number"
                                        name="po_number"
                                        fullWidth
                                        value={itemDelivery.po_number}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        error={errorItemDeliveries[index].po_number}
                                        helperText={textHelperItemDeliveries[index].po_number}
                                    />
                                </Grid>
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="product_id">Product Name</InputLabel>
                                        <Select
                                            labelId="product_id"
                                            id="product_id"
                                            label="Product Name"
                                            value={itemDelivery.product_id}
                                            onChange={(e) => handleFieldChange(index, 'product_id', e.target.value)}
                                            error={errorItemDeliveries[index].product_id}
                                        >
                                            {products.map(product => (
                                                <MenuItem key={product.id} value={product.id}>
                                                    {product.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        { textHelperItemDeliveries[index].product_id === '' ? '' : (<FormHelperText>{ textHelperItemDeliveries[index].product_id }</FormHelperText>) }
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
                                    <TextField
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={itemDelivery.quantity}
                                        fullWidth
                                        onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                                        error={errorItemDeliveries[index].quantity}
                                        helperText={textHelperItemDeliveries[index].quantity}
                                        InputProps={{ inputProps: { min: 1 } }}
                                    />
                                </Grid>
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
                                    <TextField
                                        label="Price"
                                        name="price"
                                        value={itemDelivery.price}
                                        onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Grid container item direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2, xs: 2 }}>
                                <Grid iteBreadCrumbsCmpm lg={3} xl={3} sm={3} xs={12}>
                                    <TextField
                                        label="SubTotal"
                                        name="subtotal"
                                        fullWidth
                                        value={itemDelivery.subtotal}
                                        onChange={(e) => handleFieldChange(index, 'subtotal', e.target.value)}
                                    />
                                </Grid>
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="customer_id">Customer Name</InputLabel>
                                        <Select
                                            labelId="customer_id"
                                            id="customer_id"
                                            label="Customer Name"
                                            value={itemDelivery.customer_id}
                                            onChange={(e) => handleFieldChange(index, 'customer_id', e.target.value)}
                                        >
                                            {customers.map(customer => {
                                                if (customer.hasOwnProperty('customers')) {
                                                    return (
                                                        <MenuItem key={customer['customers'].id} value={customer['customers'].id}>
                                                            {customer['customers'].firstname + ' ' + customer['customers'].lastname}
                                                        </MenuItem>
                                                    );
                                                } else {
                                                    return (
                                                        <MenuItem key={customer.id} value={customer.id}>
                                                            {customer.firstname + ' ' + customer.lastname}
                                                        </MenuItem>
                                                    );
                                                }
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    )) }
                    <Grid container justifyContent="flex-end" alignItems="flex-end" sx={{ mt: 1 }}>
                        <Tooltip title="Remove new delivery item" arrow placement="bottom">
                            <Fab color="error" onClick={handleSubtract} size="small" sx={{ mr: .5 }}><RemoveOutlined /></Fab>
                        </Tooltip>
                        <Tooltip title="Add another delivery Items" arrow placement="bottom">
                            <Fab color="primary" onClick={handleAddMore} size="small" sx={{ mr: .5 }}><AddOutlined /></Fab>
                        </Tooltip>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined />} onClick={() => handleDialog(false)}>Close</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" endIcon={<LocalShippingOutlined />} onClick={handlePreSubmit}>Deliver Item{itemDeliveries.length > 1 ? 's' : ''}</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('Product Delivery', 'Delivery', '../delivery')}/>
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <PrimaryColorBtn
                                displayText="Refresh Table"
                                endIcon={<RefreshOutlined fontSize="small" />}
                                onClick={get_delivery_items}
                            />
                        </Grid>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <PrimaryColorBtn
                                displayText="Add Delivery Items"
                                endIcon={<TruckDeliveryIcon size={18} />}
                                onClick={() => handleDialog(true)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Table Component */}
            <TableComponentV2
                columns={columns}
                rows={rows}
                loadingTable={tableLoading}
                size={rowsPerPage}
                setSize={setRowsPerPage}
                page={currentPage}
                setPage={setCurrentPage}
                search={search}
                setSearch={setSearch}
                total={maxPage}
                sx={{ mb: 5 }}
            />
        </Grid>
    );
}

export default ItemDelivery;