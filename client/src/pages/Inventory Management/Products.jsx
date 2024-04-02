import { AttachmentOutlined, CancelOutlined, DeleteOutlineRounded, DeleteRounded, EditRounded, InfoOutlined, KeyboardArrowDownRounded, LibraryAddOutlined, RefreshOutlined } from "@mui/icons-material";
import { AppBar, Button, Card, CardContent, Checkbox, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { forwardRef, useEffect, useState } from "react";
import { axios_get_header, axios_patch_header, axios_post_header_file } from 'utils/requests';
import { LoadingButton } from "@mui/lab";
import { decryptAccessToken } from "utils/auth";
import ToastCmp from "components/elements/ToastComponent";
import { toast } from "react-toastify";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { inventoryCrumbs } from "utils/breadCrumbs";
import VisuallyHidden from "components/elements/FileInputComponent";
import {
    get_Products,
    get_Parent_products,
    get_Product,
    update_Product,
    add_Product,
    remove_Product,
    get_Suppliers,
    get_Categories
} from 'utils/services';

const transitionStyle = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Products() {
    document.title = "InventoryIQ: Inventory Control - Inventory Items";
    const decrypted_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const renderActionButtons = (params) => {
        return <div>
                <IconButton onClick={() => get_product(params.value, 2)} color="primary">
                    <Tooltip title="View Product Information" placement="bottom" arrow><InfoOutlined fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => get_product(params.value, 1)} color="primary" sx={{ ml: 1 }}>
                    <Tooltip title="Update Product Information" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => remove_product(params.value)} color="error" sx={{ ml: 1 }}>
                    <Tooltip title="Remove Product Item" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
                </IconButton>
        </div>
    }

    // column definitions
    const columns = [
        { field: 'prod_name', headerName: 'Product Name', flex: 1 },
        { field: 'prod_sku', headerName: 'Product SKU', flex: 1 },
        { field: 'prod_barcode', headerName: 'Product Barcode', flex: 1 },
        { field: 'prod_price', headerName: 'Product Price', flex: 1 },
        { field: 'stocks', headerName: 'Stocks', flex: 1 },
        { field: 'category', headerName: 'Product Category', flex: 1},
        { field: 'suppliers', headerName: 'Supplier(s)', flex: 1, renderCell: (params) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', marginBottom: '10px' }}>
              {params.value.map((supplier, index) => (
                <Chip key={index} label={supplier.supp_name} color="primary" variant="outlined" size="small" />
              ))}
            </div>
          )
        },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    
    const initialFormData = {
        prod_img: '',
        prod_img_name: '',
        prod_name: '',
        stocks: 1,
        prod_sku: '',
        prod_barcode: '',
        prod_price: 1,
        prod_desc: '',
        is_variant: 0,
        weight: '',
        dimensions: '',
        parent_product_id: '',
        category_id: '',
        suppliers: [],
        warranty_info: ''
    };
    const initialFormDataError = {
        prod_img_name: false,
        prod_name: false,
        prod_sku: false,
        prod_barcode: false,
        stocks: false,
        prod_price: false,
        is_variant: false,
        weight: false,
        dimensions: false,
        prod_desc: false,
        category_id: false,
        parent_product_id: false,
    };
    const initialFormDataHelperText = {
        prod_img_name: '',
        prod_name: '',
        prod_sku: '',
        prod_barcode: '',
        stocks: '',
        prod_price: '',
        prod_desc: '',
        weight: '',
        dimensions: ''
    };

    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0); // 0 = add, 1 = edit, 2 = view
    const [parentProductDisable, setParentProductDisable] = useState(true);
    const [parentProducts, setParentProducts] = useState([]);

    // img preview
    const [imgSrc, setImgSrc] = useState('');
    // forms, form errors and form text helper
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialFormDataError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialFormDataHelperText);

    // get all the products
    const get_products = () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header(get_Products, decrypted_access_token)
        .then(response => {
            setLoadingTable(false);
            const transformedData = response.data.product_supplier.map(product_supplier => {
                return {
                    id: product_supplier['id'],
                    prod_name: product_supplier['prod_name'],
                    stocks: product_supplier['stocks'],
                    prod_sku: product_supplier['prod_sku'],
                    prod_barcode: product_supplier['prod_barcode'],
                    prod_price: product_supplier['prod_price'],
                    category: product_supplier.category.category_name,
                    suppliers: product_supplier.suppliers // Keep chips as an array
                };
            });
            setRows(transformedData);
        })
        .catch(error => { console.log(error); setLoadingTable(false); });
    };

    /* eslint-disable */
    useEffect(() => {
        get_products();
    }, []);
    /* eslint-disable */

    // get all suppliers list
    const get_suppliers = () => {
        axios_get_header(get_Suppliers, decrypted_access_token)
        .then(response => { setSuppliers(response.data.suppliers); })
        .catch(error => { console.log(error); });
    }

    // get all categories
    const get_categories = () => {
        axios_get_header(get_Categories, decrypted_access_token)
        .then(response => { setCategories(response.data.categories); })
        .catch(error => { console.log(error); });
    }

    // get the parent products if the product is a variant
    const get_parent_products = () => {
        axios_get_header(get_Parent_products, decrypted_access_token)
        .then(response => { setParentProducts(response.data.parent_products); })
        .catch(error => { console.log(error); });
    } 

    // handle the dialog show up
    const create_update_dialog = () => {
        get_categories();
        get_suppliers();
        setDialog(true);
    }

    // get the info of the selected product
    const get_product = (param, status) => {
        setEditIndex(status);

        get_categories();
        get_suppliers();

        axios_get_header(get_Product + param, decrypted_access_token)
        .then(response => {
            setDialog(true);
            const data = response.data.product_info;
            const cleanedPath = data.prod_img.substring(data.prod_img.indexOf('/') + 1);
            setFormData((prevState) => ({
                ...prevState,
                id: data.id,
                prod_name: data.prod_name,
                prod_sku: data.prod_sku,
                prod_barcode: data.prod_barcode,
                prod_price: data.prod_price,
                stocks: data.stocks,
                weight: data.weight,
                dimensions: data.dimensions,
                prod_desc: data.prod_desc,
                is_variant: data.is_variant === false ? 0 : 1,
                parent_product_id: data.parent_product_id === null ? '' : data.parent_product_id,
                category_id: data.category.id,
                warranty_info: data.warranty_info === null ? '' : data.warranty_info,
                suppliers: data.suppliers.map(supplier => supplier.id)
            }));
            setImgSrc(cleanedPath);
        })
        .catch(error => { console.log(error); });
    }

    // reset the formdata, errors and text helper
    const formDataReset = () => {
        setFormData(initialFormData);
        setFormDataError(initialFormDataError);
        setFormDataHelperText(initialFormDataHelperText);
    }

    const handleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            setEditIndex(0);
            formDataReset();   
        }
    }

    // update inputs
    const handleChange = (e) => {
        const { name, value, files, checked } = e.target;

        if (name === 'prod_img') {
            const file = files[0]; // Get the selected file

            // for attachments
            var filereader = new FileReader();
            filereader.readAsDataURL(file);
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                if (file.size <= parseInt((5 * 1024) * 1024)) { // minimum of 5MB
                    filereader.onloadend = function(e) {
                        setFormData((prevState) => ({ ...prevState, [name]: file, [`${name}_name`]: file.name }));
                        setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: false }));
                        setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: '' }));
                    }
                } else {
                    setFormData((prevState) => ({ ...prevState, [name]: '', [`${name}_name`]: '' }));
                    setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: 'File size limit is 5MB, please select another file.' }));
                }
            } else {
                setFormData((prevState) => ({ ...prevState, [`${name}_name`]: '' }));
                setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: 'Please select a valid image file (png, jpg, jpeg or gif)' }));
            }
        }

        // for basic inputs but required
        if (name === "prod_name" || name === "prod_sku" || name === "prod_barcode" || name === "prod_desc" || name === 'weight' || name === 'dimensions') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === "") {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please fill up required field!' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // for basic inputs but not required
        if (name === "warranty_info") {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }

        // for stocks
        if (name === 'stocks') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            const modifiedString = name.replace(/^prod_/, '');

            // Use a regular expression to check for a valid real number
            const isValidNumber = /^[1-9]\d*(\.\d+)?$/.test(value);

            if (value === '' || !isValidNumber) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must not be empty or zero value!' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // for product pricing
        if (name === 'prod_price') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            const modifiedString = name.replace(/^prod_/, '');

            const isValidNumber = /^[1-9]\d*(\.\d+)?$/;

            if (isValidNumber.test(value)) {
                const numericValue = parseFloat(value);

                if (numericValue === '' || numericValue <= 0) {
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must not be empty or zero value!' }));
                } else {
                    setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
                }
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must be a number' }));
            }
        }

        // for variant checkbox
        if (name === 'is_variant') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));

            if (value === 0) {
                setFormData((prevState) => ({ ...prevState, parent_product_id: '' }));
                setParentProducts([]);
                setParentProductDisable(true);
            } else {
                get_parent_products();
                setParentProductDisable(false);
            }
        }

        // for parent product
        if (name === 'parent_product_id') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value !== '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
            }
        }

        // for category type
        if (name === "category_id") {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value !== '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
            }
        }

        // for suppliers checkboxes
        if (name === "suppliers") {
            const updatedSuppliers = checked ? [...formData.suppliers, value] : formData.suppliers.filter((supplier) => supplier !== value);

            setFormData((prevState) => ({
                ...prevState,
                suppliers: updatedSuppliers,
            }));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // form data for image uploading and data submission
        const formDataSubmit = new FormData();
        formDataSubmit.append('prod_img', formData.prod_img);
        formDataSubmit.append('prod_name', formData.prod_name);
        formDataSubmit.append('stocks', formData.stocks);
        formDataSubmit.append('prod_sku', formData.prod_sku);
        formDataSubmit.append('prod_barcode', formData.prod_barcode);
        formDataSubmit.append('prod_price', formData.prod_price)
        formDataSubmit.append('prod_desc', formData.prod_desc);
        formDataSubmit.append('is_variant', formData.is_variant);
        formDataSubmit.append('weight', formData.weight);
        formDataSubmit.append('dimensions', formData.dimensions);
        formDataSubmit.append('parent_product_id', formData.parent_product_id);
        formDataSubmit.append('category_id', formData.category_id);
        formDataSubmit.append('warranty_info', formData.warranty_info);
        formDataSubmit.append('suppliers', formData.suppliers);

        // check if there's error in any fields
        let hasError = false;
        for (const field in formData) {
            if (field !== 'warranty_info' || (formData.is_variant === 0 && formData.parent_product_id === '' )) {
                if (formDataError[field] === true || formData[field] === '') {
                    hasError = true;
                    setFormDataError((prevError) => ({
                        ...prevError,
                        [field]: true
                    }));
                    setFormDataHelperText((prevText) => ({
                        ...prevText,
                        [field]: 'Please fill up required fields!'
                    }));
                } else {
                    hasError = true;
                    setFormDataError((prevError) => ({
                        ...prevError,
                        [field]: false
                    }));
                    setFormDataHelperText((prevText) => ({
                        ...prevText,
                        [field]: ''
                    }));
                }
            }
        }

        // additional form validations
        if (hasError) {
            toast.error('Oops! Something went wrong. Please check for any empty or incorrect fields.');
        } else if (formData.prod_img === "" && editIndex === 0) {
            setFormDataError((prevError) => ({ ...prevError, prod_img: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, prod_img: 'Product image is required!' }));
            toast.error('Product image is required!');
        } else if (formData.category_id === "") {
            toast.error('Please choose the category type of the Product!');
            setFormDataError((prevError) => ({ ...prevError, category_id: true }));
        } else if (formData.suppliers.length <= 0) {
            toast.error('Please choose at least one supplier!');
        } else if (formData.is_variant === 1 && formData.parent_product_id === "") {
            toast.error('Product variant must have Parent Product!')
            setFormDataError((prevError) => ({ ...prevError, parent_product_id: true }));
        } else {
            setLoading(true);
            // for update
            if (editIndex === 1) {
                axios_post_header_file(update_Product + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    toast.success(response.data.message);
                    setLoading(false);
                    setDialog(false);
                    formDataReset();
                    get_products();
                })
                .catch(error => { console.log(error); setLoading(false); toast.info(try_again); });
            } else {
                // for create
                axios_post_header_file(add_Product, formDataSubmit, decrypted_access_token)
                .then(response => {
                    toast.success(response.data.message);
                    setLoading(false);
                    formDataReset();
                    setDialog(false);
                    get_products();
                    setEditIndex(0);
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                    toast.info(try_again);
                });
            }
        }
    }

    const remove_product = (param) => {
        setFormData((prevState) => ({ ...prevState, id: param }));
        setRemoveDialog(true);
    }

    const handleRemove = (e) => {
        e.preventDefault();

        setLoading(true);
        
        axios_patch_header(remove_Product + formData.id, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            toast.success(response.data.message);
            setRemoveDialog(false);
            get_products();
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            toast.error(try_again);
        });
    }
    
    const parentProductSelect = (disabled_select) => (
        <Select
            labelId="parent_product_id"
            id="parent_parent_id"
            label="Parent Product"
            name="parent_product_id"
            fullWidth
            value={formData.parent_product_id}
            onChange={handleChange}
            error={formDataError.parent_product_id}
            disabled={disabled_select}
        >
            { parentProducts.map(parentProduct => (
                <MenuItem key={parentProduct.id} value={parentProduct.id}>
                    { parentProduct.prod_name }
                </MenuItem>
            )) }
        </Select>
    );

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />

            {/* create, view and update dialog */}
            <Dialog onClose={() => setDialog(false)} open={dialog} fullScreen TransitionComponent={transitionStyle}>
            <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => handleDialog(false)} aria-label="close">
                            <KeyboardArrowDownRounded fontSize="small"/>
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 2, flex: 1 }} component="div">
                            { editIndex === 0 ? 'New' : (editIndex === 1 ? 'Update' : 'View') } Inventory Item { editIndex === 1 || editIndex === 2 ? 'Information' : '' }
                        </Typography>
                        { editIndex === 2 ? '' : (loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>{editIndex === 1 ? 'Updating' : 'Adding'} Inventory Item</LoadingButton> : <Button color="inherit" onClick={handleSubmit}>{editIndex === 1 ? 'Update' : 'Add'} Inventory Item</Button>) }
                    </Toolbar>
                </AppBar>
                <Container maxWidth="xl" sx={{ mb: 4 }}>
                    <Grid container direction="row" columnSpacing={{ lg: 3, xl: 3 }} rowSpacing={3} sx={{ mt: 5 }}>
                        <Grid item lg={6} xl={6}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item>
                                    { editIndex === 2 ? <div style={{ display: 'flex', justifyContent: 'center' }}><img alt="Product Image" src={process.env.REACT_APP_API_BASE_IMG_URL + imgSrc} style={{ height: '150px', width: '150px', borderRadius: '50%', padding: '5px', border: '5px solid #4287f5' }}/></div>
                                    : <TextField
                                        name="prod_img_name"
                                        placeholder="Product Image (Required)"
                                        variant="outlined"
                                        error={formDataError.prod_img_name}
                                        helperText={formDataHelperText.prod_img_name}
                                        value={formData.prod_img_name ? `C:\\fakepath:\\${formData.prod_img_name}` : ''} // fake file path for the image
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        sx={{ ml: -1 }}
                                                        component="label"
                                                        disabled={editIndex === 2}
                                                    >
                                                        Upload File
                                                        <VisuallyHidden type="file" name="prod_img" accept=".png, .jpeg, .jpg, .gif" onChange={handleChange} />
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                            endAdornment: <InputAdornment position="end"><AttachmentOutlined /></InputAdornment>,
                                            readOnly: true
                                        }}
                                    />
                                    }
                                </Grid>
                                <Grid item>
                                    <TextField name="prod_name" label="Product Name" placeholder="Name of the Product (Required)" variant="outlined" disabled={editIndex === 2} value={formData.prod_name} onChange={handleChange} error={formDataError.prod_name} helperText={formDataHelperText.prod_name} fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField name="prod_sku" placeholder="Product SKU (Required)" label="SKU" variant="outlined" value={formData.prod_sku} disabled={editIndex === 2} error={formDataError.prod_sku} helperText={formDataHelperText.prod_sku} onChange={handleChange} fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField name="prod_barcode" placeholder="Product Barcode (Required)" label="Barcode" variant="outlined" value={formData.prod_barcode} disabled={editIndex === 2} error={formDataError.prod_barcode} helperText={formDataHelperText.prod_barcode} onChange={handleChange} fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField name="stocks" placeholder="Available Stocks (Required)" label="Stocks" type="number" variant="outlined" InputProps={{ inputProps: { min: 1 } }} disabled={editIndex === 2 || editIndex === 1} value={formData.stocks} onChange={handleChange} error={formDataError.stocks} helperText={formDataHelperText.stocks} fullWidth />
                                </Grid>
                                <Grid item lg={6} xl={6}>
                                    <TextField
                                        name="prod_price"
                                        placeholder="Price per Stocks (Required)"
                                        label="Price per stocks"
                                        variant="outlined"
                                        value={formData.prod_price}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>
                                        }}
                                        fullWidth
                                        disabled={editIndex === 2}
                                        onChange={handleChange}
                                        error={formDataError.prod_price}
                                        helperText={formDataHelperText.prod_price}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xl={6} lg={6}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="category_id">Category *</InputLabel>
                                        <Select
                                            labelId="category_id"
                                            id="category"
                                            label="Category *"
                                            name="category_id"
                                            fullWidth
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            disabled={editIndex === 2}
                                            error={formDataError.category_id}
                                        >
                                            { categories.map(category => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    { category.category_name }
                                                </MenuItem>
                                            )) }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="is_variant">Is variant?</InputLabel>
                                        <Select
                                            labelId="is_variant"
                                            id="is_variant"
                                            label="Is variant?"
                                            name="is_variant"
                                            fullWidth
                                            value={formData.is_variant}
                                            onChange={handleChange}
                                            disabled={editIndex === 2}
                                            error={formDataError.is_variant}
                                        >
                                            <MenuItem value={0}>No</MenuItem>
                                            <MenuItem value={1}>Yes</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                { formData.is_variant ? (
                                    <Grid item>
                                        <FormControl fullWidth>
                                            <InputLabel id="parent_product_id">Parent Product</InputLabel>
                                            { editIndex === 0 ? (
                                                parentProductSelect(parentProductDisable)
                                            ) : (
                                                parentProducts.length > 0 ? (<Select
                                                    labelId="parent_product_id"
                                                    id="parent_parent_id"
                                                    label="Parent Product"
                                                    name="parent_product_id"
                                                    fullWidth
                                                    value={formData.parent_product_id}
                                                    onChange={handleChange}
                                                    disabled={editIndex === 2 || parentProductDisable === true}
                                                    error={formDataError.parent_product_id}
                                                >
                                                    { parentProducts.length > 0 ? (parentProducts.map(parentProduct => (
                                                    <MenuItem key={parentProduct.id} value={parentProduct.id}>
                                                        { parentProduct.prod_name }
                                                    </MenuItem>
                                                ))) : (<MenuItem value="">&nbsp;</MenuItem>) }
                                                </Select>) : (
                                                    parentProductSelect(true)
                                                )
                                            ) }
                                        </FormControl>
                                    </Grid>
                                )
                                : ''
                                }
                                <Grid item>
                                    <TextField name="weight" placeholder="Weight of the Product (Required)" label="Product Weight" value={formData.weight} error={formDataError.weight} helperText={formDataHelperText.weight} disabled={editIndex === 2} fullWidth variant="outlined" onChange={handleChange} />
                                </Grid>
                                <Grid item>
                                    <TextField name="dimensions" placeholder="Dimensions of the Product (Required)" label="Product Dimensions" value={formData.dimensions} error={formDataError.dimensions} helperText={formDataHelperText.dimensions} disabled={editIndex === 2} fullWidth variant="outlined" onChange={handleChange} />
                                </Grid>
                                <Grid item>
                                    <TextField name="prod_desc" placeholder="Description of the Product (Required)" label="Product Description" multiline disabled={editIndex === 2} maxRows="3" value={formData.prod_desc} onChange={handleChange} error={formDataError.prod_desc} helperText={formDataHelperText.prod_desc} fullWidth variant="outlined" />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={12} xl={12}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item>
                                    <TextField name="warranty_info" label="Warranty Information" rows={2} multiline placeholder="Warranty Information (Optional)" value={formData.warranty_info} fullWidth variant="outlined" onChange={handleChange} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={12} xl={12}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item sx={{ border: '1px solid #999', mt: 3, borderRadius: 1.5 }}>
                                    { suppliers.length > 0 ? (
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <FormGroup sx={{ pl: 2, pb: 1 }}>
                                            <Typography variant="body1">Suppliers</Typography>
                                            { suppliers.map(supplier => (
                                                <FormControlLabel control={<Checkbox disabled={editIndex === 2} />} checked={formData.suppliers.includes(supplier.id)} label={supplier.supp_name} value={supplier.id} key={supplier.id} name="suppliers" onChange={handleChange} />
                                            )) }
                                        </FormGroup>
                                    </div>
                                    ) : (
                                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            <FormGroup sx={{ pl: 2, pb: 3.5 }}>
                                                <Typography variant="body1">No Suppliers yet...</Typography>
                                            </FormGroup>
                                        </div>
                                    ) }
                                    
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Dialog>

            {/* remove dialog for products */}
            <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Inventory Item</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">This inventory item will be deleted, are you sure about this?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 1, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="primary" endIcon={<CancelOutlined />} onClick={() => setRemoveDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            { loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Removing Supplier Partner</LoadingButton> : <Button variant="contained" color="error" endIcon={<DeleteOutlineRounded />} onClick={handleRemove}>Remove Inventory Item</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* buttons and products table */}
            <Grid container justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: .3 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={inventoryCrumbs('Products')} />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" color="primary" endIcon={<RefreshOutlined fontSize="small" />} onClick={get_products}>Refresh Table</Button>
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" color="primary" endIcon={<LibraryAddOutlined fontSize="small" />} onClick={create_update_dialog}>Add Inventory Items</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%' }}>
                        <CardContent>
                            <DataGrid rows={rows} columns={columns} loading={loadingTable} autoHeight={rows.length >= 1 ? false : true} getRowHeight={() => 'auto'}/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Products;