import {
    CancelOutlined,
    DeleteRounded,
    DownloadRounded,
    EditRounded,
    LibraryAddOutlined,
    RefreshOutlined
} from "@mui/icons-material";
import {
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
    axios_delete_header,
    axios_get_header,
    axios_post_header_file
} from 'utils/requests';
import { decryptAccessToken } from "utils/auth";
import ToastCmp from "components/elements/ToastComponent";
import { toast } from "react-toastify";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { inventoryCrumbs } from "utils/breadCrumbs";
import {
    get_Products,
    get_Parent_products,
    get_Product,
    update_Product,
    add_Product,
    remove_Product,
    get_Suppliers,
    get_Categories,
    get_Categories_warehouses,
    get_Parent_products_exclude_self,
    download_Product_image
} from 'utils/services';
import { apiGetHelper, decimalNumRegex, fileNameSplit, firstCap, nullCheck, pathCleaner, setData, setErrorHelper, wholeNumRegex } from "utils/helper";
import AddUpdateContent from "components/pages/Inventory/Products/Add_Update";
import { ErrorColorBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import Remove from "components/pages/Inventory/Products/Remove";

function Products() {
    document.title = "InventoryIQ: Inventory Control - Inventory Items";
    const decrypted_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const renderActionButtons = (params) => {
        return (
            <div>
                <IconButton onClick={() => get_product(params.value, 1)} color="primary" sx={{ ml: 1 }}>
                    <Tooltip title="Update Product Information" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => get_product(params.value, 0)} color="error" sx={{ ml: 1 }}>
                    <Tooltip title="Remove Product" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => download(params.value)} color="primary" sx={{ ml: 1 }}>
                    <Tooltip title="Download Product Image" placement="bottom" arrow><DownloadRounded fontSize="small"/></Tooltip>
                </IconButton>
            </div>
        );
    }

    // column definitions
    const columns = [
        { field: 'name', headerName: 'Product Name', flex: 1 },
        { field: 'sku', headerName: 'Product SKU', flex: 1 },
        { field: 'barcode', headerName: 'Product Barcode', flex: 1 },
        { field: 'price', headerName: 'Product Price', flex: 1 },
        { field: 'stocks', headerName: 'Stocks', flex: 1 },
        { field: 'category', headerName: 'Product Category', flex: 1},
        { field: 'warehouse', headerName: 'Assigned Warehouse', flex: 1 },
        { field: 'suppliers', headerName: 'Supplier(s)', flex: 1, renderCell: (params) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px', marginBottom: '10px' }}>
              {params.value.map((supplier, index) => (
                <Chip key={index} label={supplier.name} color="primary" variant="outlined" size="small" />
              ))}
            </div>
          )
        },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    
    const initialFormData = {
        image: '',
        image_name: '',
        name: '',
        stocks: 1,
        sku: '',
        barcode: '',
        price: 1,
        description: '',
        is_variant: 0,
        weight: '',
        dimensions: '',
        parent_product_id: '',
        category_id: '',
        warehouse_id: '',
        has_serial: 0,
        serial_number: '',
        suppliers: [],
        warranty_info: ''
    };
    const initialFormDataError = {
        image_name: false,
        name: false,
        sku: false,
        barcode: false,
        stocks: false,
        price: false,
        is_variant: false,
        weight: false,
        dimensions: false,
        description: false,
        category_id: false,
        warehouse_id: false,
        has_serial: false,
        serial_number: false,
        parent_product_id: false,
        suppliers: false
    };
    const initialFormDataHelperText = {
        image_name: '',
        name: '',
        sku: '',
        barcode: '',
        stocks: '',
        price: '',
        description: '',
        weight: '',
        dimensions: '',
        serial_number: ''
    };

    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0); // 0 = add, 1 = edit, 2 = view
    const [parentProducts, setParentProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialFormDataError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialFormDataHelperText);

    // get all the products
    const get_products = () => {
        setLoadingTable(true);
        axios_get_header(get_Products, decrypted_access_token)
        .then(response => {
            setLoadingTable(false);
            const data = response.data;
            const transformedData = data.product_supplier.map(product_supplier => {
                return {
                    id: product_supplier?.id,
                    name: product_supplier?.name,
                    stocks: product_supplier?.stocks,
                    sku: product_supplier?.sku,
                    barcode: product_supplier?.barcode,
                    price: product_supplier?.price,
                    category: product_supplier?.category?.name,
                    warehouse: product_supplier?.warehouse?.name,
                    suppliers: product_supplier.suppliers // Keep chips as an array
                };
            });
            setRows(transformedData);
        })
        .catch(error => { console.log(error); setLoadingTable(false); });
    };

    /* eslint-disable */
    useEffect(() => { get_products(); }, []);
    /* eslint-disable */

    // get all suppliers list
    const get_suppliers = () => {
        apiGetHelper(get_Suppliers, setSuppliers, 'suppliers');
    };

    // get all categories
    const get_categories = () => {
        apiGetHelper(get_Categories, setCategories, 'categories');
    };

    const get_warehouses = (id) => {
        apiGetHelper(`${get_Categories_warehouses}${id}`, setWarehouses, 'warehouses');
    };

    // get the parent products if the product is a variant
    const get_parent_products = () => {
        apiGetHelper(get_Parent_products, setParentProducts, 'parent_products');
    };

    const get_parent_products_exclude_self = (id) => {
        apiGetHelper(`${get_Parent_products_exclude_self}${id}`, setParentProducts, 'parent_products');
    }

    // get the info of the selected product
    const get_product = async (param, editIndexVal) => {
        try {
            const response = await axios_get_header(`${get_Product}${param}`, decrypted_access_token)
            const data = response.data;
            const product = data.product_info;
            setEditIndex(editIndexVal);

            if (editIndexVal === 1) {
                setFormData((prevState) => ({
                    ...prevState,
                    id: product?.id,
                    name: product?.name,
                    image_name: fileNameSplit(product?.image),
                    sku: product?.sku,
                    barcode: product?.barcode,
                    price: product?.price,
                    stocks: product?.stocks,
                    weight: product?.weight,
                    dimensions: product?.dimensions,
                    description: product?.description,
                    is_variant: product?.is_variant === false ? 0 : 1,
                    parent_product_id: nullCheck(product?.parent_product_id) ? '' : product?.parent_product_id,
                    category_id: product?.category.id,
                    warehouse_id: product?.warehouse_id,
                    warranty_info: nullCheck(product?.warranty_info) ? '' : product?.warranty_info,
                    suppliers: product?.suppliers?.map(supplier => supplier.id)
                }));
                if (product?.is_variant === true) {
                    get_parent_products_exclude_self(product?.id);
                }
                apiGetHelper(`${get_Categories_warehouses}${product?.category_id}`, setWarehouses, 'warehouses');
                setImgSrc(`${process.env.REACT_APP_API_BASE_IMG_URL}${pathCleaner(product.image)}`);
                handleDialog(true);
            } else {
                setData(setFormData, 'id', product?.id);
                setRemoveDialog(true);
            }
        } catch (error) {
            console.error('Data Fetching Error: ', error);
            throw error;
        }
    }

    const handleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            setEditIndex(0);
            setFormData(initialFormData);
            setFormDataError(initialFormDataError);
            setFormDataHelperText(initialFormDataHelperText);
            setCategories([]);
            setWarehouses([]);
            setSuppliers([]);
            setImgSrc('');
        } else {
            get_categories();
            get_suppliers();
        }
    }

    // update inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const basicInputs = [
            'name',
            'sku',
            'barcode',
            'description',
            'weight',
            'dimensions',
            'warranty_info',
            'parent_product_id',
            'category_id',
            'warehouse_id',
            'suppliers',
        ];
        
        if (name !== 'image') {
            setData(setFormData, name, value);
            for (const field in basicInputs) {
                if (field !== 'warranty_info' && value === '') {
                    setErrorHelper(name, true, 'Please fill up required field', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
            }
        }

        if (name === 'image') {
            const file = files[0]; // Get the selected file

            // for attachments
            if (file) {
                var filereader = new FileReader();
                filereader.readAsDataURL(file);
                if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                    if (file.size <= parseInt((5 * 1024) * 1024)) { // minimum of 5MB
                        filereader.onloadend = function(e) {
                            setImgSrc(filereader.result);
                            setData(setFormData, name, file);
                            setData(setFormData, `${name}_name`, file.name);
                            setErrorHelper(`${name}_name`, false, '', setFormDataError, setFormDataHelperText);
                        }
                    } else {
                        setData(setFormData, name, '');
                        setData(setFormData, `${name}_name`, '');
                        setErrorHelper(`${name}_name`, true, 'File size limit is 5MB, please select another file.', setFormDataError, setFormDataHelperText);
                        toast.error('File size limit is only 5MB');
                    }
                } else {
                    setData(setFormData, name, '');
                    setData(setFormData, `${name}_name`, '');
                    setErrorHelper(`${name}_name`, true, 'Please select a valid image file (png, jpg, jpeg or gif)', setFormDataError, setFormDataHelperText);
                    toast.error('.png, .jpg, .jpeg or .gif are only allowed');
                }
            }
        }

        // for stocks
        if (name === 'stocks') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setErrorHelper(name, true, `${firstCap(name)} must not be empty!`, setFormDataError, setFormDataHelperText);
            } else if (!wholeNumRegex(value)) {
                setErrorHelper(name, true, `${firstCap(name)} must be greater than zero and a valid number`, setFormDataError, setFormDataHelperText);
            } else {
                setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
            }
        }

        // for product pricing
        if (name === 'price') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (decimalNumRegex(value)) {
                const numericValue = parseFloat(value);

                if (numericValue === '' || numericValue <= 0) {
                    setErrorHelper(name, true, `${firstCap(name)} must not be empty or zero value!`, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
            } else {
                setErrorHelper(name, true, `${firstCap(name)} must be a valid number or decimal value`, setFormDataError, setFormDataHelperText);
            }
        }

        // for variant checkbox
        if (name === 'is_variant') {
            if (value === 0) {
                setData(setFormData, 'parent_product_id', '');
                setParentProducts([]);
            } else {
                if (editIndex === 1) {
                    get_parent_products_exclude_self(formData?.id);
                } else {
                    get_parent_products();
                }
            }
        }

        if (name === 'category_id') {
            if (nullCheck(value)) {
                setData(setFormData, 'warehouse_id', '');
                setWarehouses([]);
            } else {
                get_warehouses(value);
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // form data for image uploading and data submission
        const formDataSubmit = new FormData();
        for (const field in formData) {
            if (field !== 'image_name' ) {
                formDataSubmit.append(field, formData[field]);
            }
        }

        // check if there's error in any fields
        let hasError = false;
        let hasSerial = formData.has_serial === 1 && nullCheck(formData.serial_number);
        let isVar = formData.is_variant === 1 && nullCheck(formData.parent_product_id);
        for (const field in formData) {
            const isFieldEmpty = nullCheck(formData[field]);
            const isFieldError = formDataError[field] === true;
            
            if (editIndex === 0) {
                if (isVar) {
                    hasError = true;
                    setFormDataError((prevError) => ({ ...prevError, parent_product_id: true }));
                } else if (hasSerial) {
                    hasError = true;
                    setErrorHelper('serial_number', true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                } else if (field !== 'warranty_info' && isFieldEmpty && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                }
            } else if (editIndex === 1) {
                if (isVar) {
                    hasError = true;
                    setFormDataError((prevError) => ({ ...prevError, parent_product_id: true }));
                } else if (hasSerial) {
                    hasError = true;
                    setErrorHelper('serial_number', true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                } else if (field !== 'warranty_info' && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                }
            }
        }

        // additional form validations
        if (hasError) {
            toast.error('Oops! Something went wrong. Please check for any empty or incorrect fields.');
        } else if (formData?.image === "" && editIndex === 0) {
            setErrorHelper('image', true, 'Product image is required', setFormDataError, setFormDataHelperText);
            toast.error('Product image is required!');
        } else if (formData?.category_id === "") {
            toast.error('Please choose the category type of the Product!');
            setFormDataError((prevError) => ({ ...prevError, category_id: true }));
        } else if (formData?.suppliers?.length <= 0) {
            toast.error('Please choose at least one supplier!');
            setFormDataError((prevError) => ({ ...prevError, suppliers: true }));
        } else if (formData?.is_variant === 1 && nullCheck(formData?.parent_product_id)) {
            toast.error('Product is a variant, please choose its parent product.')
            setFormDataError((prevError) => ({ ...prevError, parent_product_id: true }));
        } else if (formData?.has_serial === 1 && nullCheck(formData?.serial_number)) {
            toast.error('Product has a serial, please provide the serial number.');
            setErrorHelper('serial_number', true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
        } else {
            setLoading(true);
            // for update
            if (editIndex === 1) {
                axios_post_header_file(update_Product + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    toast.success(response.data.message);
                    setLoading(false);
                    handleDialog(false);
                    get_products();
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                    toast.info(try_again);
                });
            } else {
                // for create
                axios_post_header_file(add_Product, formDataSubmit, decrypted_access_token)
                .then(response => {
                    toast.success(response.data.message);
                    setLoading(false);
                    handleDialog(false);
                    get_products();
                })
                .catch(error => {
                    console.log(error);
                    setLoading(false);
                    toast.info(try_again);
                });
            }
        }
    }

    const handleRemove = async () => {
        setLoading(true);
        axios_delete_header(`${remove_Product}${formData?.id}`, {}, decrypted_access_token)
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
    };

    const download = async (id) => {
        try {
            window.open(`${download_Product_image}${id}`);
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />

            {/* create, view and update dialog */}
            <Dialog open={dialog} fullWidth maxWidth="md">
                <DialogTitle>{editIndex === 1 ? 'Update' : 'Add New'} Product</DialogTitle>
                    <Divider sx={{ mt: -1.5 }}>
                        <Typography variant="body1">Primary Information (Required)</Typography>
                    </Divider>
                <DialogContent>
                    <AddUpdateContent
                        formData={formData}
                        formDataError={formDataError}
                        formDataHelperText={formDataHelperText}
                        categories={categories}
                        warehouses={warehouses}
                        suppliers={suppliers}
                        parentProducts={parentProducts}
                        handleChange={handleChange}
                        imgSrc={imgSrc}
                        editIndex={editIndex}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={editIndex === 1 && !loading ? 'Update Product'
                                : (editIndex === 1 && loading ? 'Updating Product'
                                : (editIndex === 0 && !loading ? 'Add Product'
                                : (editIndex === 0 && loading ? 'Adding Product'
                                : '')))}
                                endIcon={<LibraryAddOutlined />}
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined />}
                                onClick={() => handleDialog(false)}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* remove dialog for products */}
            <Remove
                removeDialog={removeDialog}
                setRemoveDialog={setRemoveDialog}
                loading={loading}
                handleRemove={handleRemove}
            />

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
                            <Button variant="contained" color="primary" endIcon={<LibraryAddOutlined fontSize="small" />} onClick={() => handleDialog(true)}>Add Inventory Items</Button>
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