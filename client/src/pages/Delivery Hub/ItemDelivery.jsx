import { AddLocationAltOutlined, AddOutlined, CancelOutlined, CloseRounded, LocalShippingOutlined, RemoveOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fab, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { Fragment, useEffect, useState } from "react";
import { axios_get_header, axios_post_header } from "../../request/apiRequests";
import { decryptAccessToken } from "../../auth/AuthUtils";

function ItemDelivery() {
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const columns = [
        { field: 'po_number', headerName: 'PO Number', flex: 1 },
        { field: 'batch', headerName: 'Batch Number', flex: 1 },
        { field: 'product', headerName: 'Product Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'price', headerName: 'Product Price', flex: 1 },
        { field: 'customer', headerName: 'Customer', flex: 1 },
        { field: 'subtotal', headerName: 'Subtotal', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1 }
    ];
    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [submitDialog, setSubmitDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
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
    const [forceRender, setForceRender] = useState(false); // Initialize a state variable

    const handleSnackbar = (status, message) => {
        setSnackbar((prevSnack) => ({ ...prevSnack, open: status, message: message }));
    };

    // close button on snackbar
    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="cancel"
                color="inherit"
                onClick={() => handleSnackbar(false, '')}
            >
                <CloseRounded fontSize="small" />
            </IconButton>
        </Fragment>
    );
    
    const get_delivery_items = async () => {
        await axios_get_header('/delivery_hub/item_delivery/get_items', decrypt_access_token)
        .then(response => {
            const data = response.data;
            const items = data.items;
            const transformedData = items.map(item => {
                return {
                    id: item.id,
                    po_number: item.po_number,
                    batch: item.batches.batch_num,
                    product: item.products.prod_name,
                    quantity: item.quantity,
                    price: item.price,
                    customer: item.customers.firstname + ' ' + item.customers.lastname,
                    subtotal: item.subtotal
                };
            });
            setRows(transformedData);
        })
        .catch(error => {
            handleSnackbar(true, try_again);
            console.log(error);
        });
    };

    useEffect(() => {
        get_delivery_items();
    }, []);

    const get_products = async () => {
        await axios_get_header('/product/get_products', decrypt_access_token)
        .then(response => {
            const data = response.data;
            setProducts(data.products);
        })
        .catch(error => {
            handleSnackbar(true, try_again);
            console.log(error);
            
        });
    };

    const get_customers = async () => {
        await axios_get_header('/delivery_hub/customer/get_paid_customers', decrypt_access_token)
        .then(response => {
            const data = response.data;
            setCustomers(data.customers);
        })
        .catch(error => {
            handleSnackbar(true, try_again);
            console.log(error);
        });
    };

    const generate_batch_number = async () => {
        await axios_get_header('/delivery_hub/item_delivery/generate_batch_number', decrypt_access_token)
        .then(response => {
            const data = response.data;
            setBatchNumber(data.batch_number);
        })
        .catch(error => {
            handleSnackbar(true, try_again);
            console.log(error);
        });
    };

    const generate_po_number = async () => {
        try {
            const response = await axios_get_header('/delivery_hub/item_delivery/generate_po_number', decrypt_access_token);
            const data = response.data;
            return data.delivery_po_number;
        } catch (error) {
            handleSnackbar(true, try_again);
            console.log(error);
            return '';
        }
    };

    const get_product_price = async (product_id) => {
        try {
            const response = await axios_get_header('/product/get_price/' + product_id, decrypt_access_token);
            const data = response.data;
            return data.price;
        } catch (error) {
            handleSnackbar(true, try_again);
            console.log(error);
            return '';
        }
    };

    const get_delivery_persons = async () => {
        axios_get_header('/delivery_hub/delivery_person/get_delivery_persons', decrypt_access_token)
        .then(response => {
            const data = response.data;
            setDeliveryPersons(data.delivery_persons);
        })
        .catch(error => {
            console.log(error);
            handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
        });
    }

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
            console.log("Cannot remove the last item delivery.");
        }
    };

    const handleDialog = async (status) => {
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
        }
    };

    const handleFieldChange = async (index, field, value) => {
        const newDeliveries = [...itemDeliveries];
        const errorDeliveries = [...errorItemDeliveries];
        const textHelperDeliveries = [...textHelperItemDeliveries];
        if (field === 'quantity') {
            // update the item deliveries with the new value
            newDeliveries[index][field] = value;
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
                        handleSnackbar(true, 'You already added this product for this customer, please choose another product.');
                        
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
                    handleSnackbar(true, 'Duplicate Product detected with the same customer, please choose another product.');

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
            handleSnackbar(true, 'Please check any error or empty fields.');
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

        axios_post_header('/delivery_hub/item_delivery/deliver_items', data, decrypt_access_token)
        .then(response => {
            const data = response.data;
            handleSnackbar(true, data.message);
            handleDialog(false);
            setItemDeliveries(initialDeliveries);
            setBatchNumber('');
            setDeliveryPersonId('');
        })
        .catch(error => {
            handleSnackbar(true, try_again);
            console.log(error);
        });
    }

    return (
        <Grid container direction="row" justifyContent="flex-start" sx={{ px: 2, mt: 5 }}>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => handleSnackbar(false, '')} message={snackbar.message} action={action} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />

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
                            <Button variant="contained" color="primary" endIcon={<LocalShippingOutlined />} onClick={handleSubmit}>Proceed</Button>
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
                                                    {product.prod_name}
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
                                <Grid item lg={3} xl={3} sm={3} xs={12}>
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
                                        <InputLabel id="product_id">Customer Name</InputLabel>
                                        <Select
                                            labelId="customer_id"
                                            id="customer_id"
                                            label="Customer Name"
                                            value={itemDelivery.customer_id}
                                            onChange={(e) => handleFieldChange(index, 'customer_id', e.target.value)}
                                        >
                                            { customers.map(
                                                customer => (
                                                    <MenuItem key={customer['customers'].id} value={customer['customers'].id}>
                                                        { customer['customers'].firstname + ' ' + customer['customers'].lastname }
                                                    </MenuItem>
                                                ))
                                            }
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
            <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }}>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<AddLocationAltOutlined fontSize="small" />} onClick={() => handleDialog(true)}>Add New Item Delivery</Button>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%' }}>
                        <CardContent>
                            <DataGrid columns={columns} rows={rows} autoHeight />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ItemDelivery;