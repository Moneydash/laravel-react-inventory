import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import { 
    AddShoppingCartOutlined,
    CancelOutlined,
    EditRounded,
    FlagRounded,
    RefreshOutlined,
    ThumbDownAltRounded,
    ThumbUpAltRounded
} from "@mui/icons-material";
import { axios_get_header, axios_patch_header, axios_post_header_file } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import {
    get_Purchase_orders,
    generate_Po,
    get_Purchase_order,
    update_Purchase_order,
    add_Purchase_order,
    get_Suppliers,
    get_Supplier_products,
    get_Warehouses,
    generate_Track_number,
    update_Purchase_approval,
    close_Order
} from 'utils/services';
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import {
    apiFormGetHelper,
    apiGetHelper,
    crumbsHelper,
    decimalNumRegex,
    firstCap, 
    nullCheck,
    setData,
    setErrorHelper,
    setErrorOnly,
    twoDigitDecimal,
    validate_file,
    wholeNumRegex
} from "utils/helper";
import TableComponent from "components/elements/TableComponent";
import ToastCmp from "components/elements/ToastComponent";
import { toast } from "react-toastify";
import { SelectCmp } from "components/elements/FieldComponents";
import AddUpdateContent from "components/pages/Inventory/PurchaseOrder/Add_Update";
import { ErrorColorBtn, ErrorColorIconBtn, PrimaryColorIconBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import dayjs from "dayjs";
import CloseOrder from "components/pages/Inventory/PurchaseOrder/Close";

function PurchaseOrder() {
    document.title = 'InventoryIQ: Purchase Order';
    const decrypted_access_token = decryptAccessToken(); // decrypt access token
    const renderActionButtons = (params) => {
        const approve_btn = (
            <PrimaryColorIconBtn
                fn={() => purchase_approval(params.value, 1)}
                title="Approve Purchase"
                icon={<ThumbUpAltRounded fontSize="small" />}
            />
        );
        const disapprove_btn = (
            <ErrorColorIconBtn
                fn={() => purchase_approval(params.value, 2)}
                title="Disapprove Purchase"
                icon={<ThumbDownAltRounded fontSize="small" />}
                sx={{ ml: 1 }}
                disabled={params.row.order_status === 1}
            />
        );
        const edit_btn = (
            <PrimaryColorIconBtn
                fn={() => get_purchase_order(params.value, 1)}
                title="Update Purchase Order"
                icon={<EditRounded fontSize="small" />}
                sx={{ ml: 1 }}
            />
        );
        const close_btn = (
            <PrimaryColorIconBtn
                fn={() => get_purchase_order(params.value, 0)}
                title="Flagged as Closed"
                icon={<FlagRounded />}
                sx={{ ml: 1 }}
                disabled={params.row.order_status === 1}
            />
        );
        
        switch(params.row.approval) {
            case 0:
                return (
                    <>
                        { approve_btn }
                        { disapprove_btn }
                        { edit_btn }
                    </>
                );
            case 1:
                return (
                    <>
                        { disapprove_btn }
                        { close_btn }
                    </>
                );
            case 2:
                return (
                    <>
                        { approve_btn }
                    </>
                );
            default:
                return null;
        }
    }

    const columns = [
        { field: 'po_number', headerName: 'PO Number', flex: 1 },
        { field: 'supplier_id', headerName: 'Supplier Name', flex: 1 },
        { field: 'product_id', headerName: 'Product Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'unit_price', headerName: 'Unit Price', flex: 1 },
        { field: 'discount', headerName: 'Discount', flex: 1 },
        { field: 'subtotal', headerName: 'SubTotal', flex: 1 },
        { field: 'tax_rate', headerName: 'Tax Rate', flex: 1 },
        { field: 'tax_amount', headerName: 'Tax Amount', flex: 1 },
        { field: 'total', headerName: 'Total Amount', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [editIndex, setEditIndex] = useState(0); // 0 = add, 1 = edit, 2 = view
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productPrice, setProductPrice] = useState('');
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warehouse, setWarehouse] = useState([]);
    const [approvalType, setApprovalType] = useState(0);
    const [closeDialog, setCloseDialog] = useState(false);
    const initialState = {
        po_number: '',
        supplier_id: '',
        billing_address: 'Comembo, Makati City', // temporarily hard coded, will add on the configurations later.
        product_id: '',
        tracking_num: '',
        quantity: '',
        unit_price: '',
        subtotal: '',
        po_notes: '',
        tax_rate: 12, // temporarily hard coded, will also add to the configurations later.
        tax_amount: '',
        total: '',
        shipping_date: 'No shipping date until approved.',
        discount: 0,
        shipping_method: '',
        additional_charges: '',
        documents: '',
        documents_name: '',
        priority_lvl: 3,
        warehouse_id: ''
    };
    const initialError = {
        supplier_id: false,
        product_id: false,
        quantity: false,
        unit_price: false,
        discount: false,
        shipping_method: false,
        documents_name: false,
        priority_lvl: false,
        warehouse_id: false
    };
    const initialHelper = {
        quantity: '',
        unit_price: '',
        documents_name: '',
    };
    const [formData, setFormData] = useState(initialState);
    const [formDataError, setFormDataError] = useState(initialError);
    const [formDataHelpertext, setFormDataHelperText] = useState(initialHelper);
    const approval_list = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Approved' },
        { id: 2, name: 'Disapprove' }
    ];

    const calculateSubtotal = (price, quantity) => {
        return parseFloat(price * quantity).toFixed(2);
    }

    const calculateDiscountSubtotal = (subtotal, discount) => {
        const disc_subtot = subtotal - (subtotal * (discount / 100));
        return parseFloat(disc_subtot).toFixed(2);
    }

    const calculateTaxAmnt = (disc_subtotal, taxRate) => {
        return parseFloat(disc_subtotal * (taxRate / 100)).toFixed(2);
    }

    const calculateTotalAmnt = (disc_subtotal, taxAmnt) => {
        const disc_sub = parseFloat(disc_subtotal);
        const taxAmt = parseFloat(taxAmnt);
        return parseFloat(disc_sub + taxAmt).toFixed(2);
    }

    const get_purchase_orders = (approval_type) => {
        setLoadingTable(true);
        axios_get_header(`${get_Purchase_orders}${approval_type}`, decrypted_access_token)
        .then(response => {
            const data = response.data;
            const po_data = data.purchase_order_data;
            const transformedData = po_data.map(purchase_order => {
                const supplierName = purchase_order.suppliers.name;
                const productName = purchase_order.products.name;

                return {
                    id: purchase_order['po_number'],
                    po_number: purchase_order['po_number'],
                    supplier_id: supplierName,
                    product_id: productName,
                    quantity: purchase_order['quantity'],
                    unit_price: `₱ ${twoDigitDecimal(purchase_order['unit_price'])}`,
                    discount: `${purchase_order['discount']} %`,
                    subtotal: `₱ ${twoDigitDecimal(purchase_order['subtotal'])}`,
                    tax_rate: `${purchase_order['tax_rate']} %`,
                    tax_amount: `₱ ${twoDigitDecimal(purchase_order['tax_amount'])}`,
                    total: `₱ ${twoDigitDecimal(purchase_order['total'])}`,
                    approval: purchase_order['approval_status'],
                    order_status: purchase_order['order_status']
                }
            });
            setLoadingTable(false);
            setRows(transformedData);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    const handleApprovalTypeChange = (e) => {
        let appr_type = e.target.value;
        setApprovalType(appr_type);
        get_purchase_orders(appr_type);
    }

    /* eslint-disable */
    useEffect(() => {
        get_purchase_orders(approvalType);
    }, []);
    /* eslint-disable */

    const generate_po_number = () => {
        apiFormGetHelper(generate_Po, setFormData, 'po_number', 'po_number');
    };

    const generate_tracking_num = () => {
        apiFormGetHelper(generate_Track_number, setFormData, 'tracking_num', 'tracking_number');
    };

    const get_suppliers = () => {
        apiGetHelper(get_Suppliers, setSuppliers, 'suppliers');
    };

    const get_supplier_products = (supplier_id) => {
        apiGetHelper(`${get_Supplier_products}${supplier_id}`, setProducts, 'supplier_products');
    };

    const get_warehouses = () => {
        apiGetHelper(get_Warehouses, setWarehouse, 'warehouses');
    };

    const formDataReset = () => {
        setFormData(initialState);
        setFormDataError(initialError);
        setFormDataHelperText(initialHelper);
        setSuppliers([]);
        setProducts([]);
        setWarehouse([]);
        setProductPrice('');
        setEditIndex(0);
    };

    const refresh_table = () => {
        setApprovalType(0);
        get_purchase_orders(0);
    }

    const handleDialog = (status) => {
        get_suppliers();
        get_warehouses();
        if (nullCheck(formData?.po_number)) {
            generate_po_number();
        }

        if (nullCheck(formData?.tracking_num)) {
            generate_tracking_num();
        }
        if (status === false) {
            formDataReset();
        }
        setDialog(status);
    };

    const get_purchase_order = async (param, status) => {

        get_suppliers();
        get_warehouses();
        try {
            const response = await axios_get_header(get_Purchase_order + param, decrypted_access_token);
            const data = response.data;
            const po_data = data.purchase_order_data;
            get_supplier_products(po_data?.supplier_id);

            if (status === 1) {
                setEditIndex(status);
                setFormData((prevState) => ({
                    ...prevState,
                    po_number: po_data?.po_number,
                    supplier_id: po_data?.supplier_id,
                    product_id: po_data?.product_id,
                    quantity: po_data?.quantity,
                    unit_price: po_data?.unit_price,
                    subtotal: po_data?.subtotal,
                    tax_rate: po_data?.tax_rate,
                    tax_amount: po_data?.tax_amount,
                    total: po_data?.total,
                    discount: po_data?.discount,
                    shipping_date: dayjs(),
                    shipping_method: po_data?.shipping_method,
                    billing_address: po_data?.billing_address,
                    additional_charges: nullCheck(po_data?.additional_charges) ? '' : po_data?.additional_charges,
                    documents_name: po_data?.documents,
                    po_notes: nullCheck(po_data?.po_notes) ? '' : po_data?.po_notes,
                    priority_lvl: po_data?.priority_lvl,
                    tracking_num: po_data?.tracking_num,
                    warehouse_id: po_data?.warehouse_id
                }));
                setDialog(true);
            } else {
                setData(setFormData, 'id', po_data?.po_number);
                setCloseDialog(true);
            }
        } catch (error) {
            console.error("Fetch Error: ", error);
            throw error;
        }
    };

    const purchase_approval = async (id, status) => {
        try {
            const response = await axios_patch_header(`${update_Purchase_approval}${id}/${status}`, {}, decrypted_access_token);
            const data = response.data;
            
            get_purchase_orders(approvalType);
            toast.success(data.message);
        } catch (error) {
            console.error('Approval Error: ', error);
            throw error;
        }
    }

    const close_order = async (id) => {
        try {
            const response = await axios_patch_header(`${close_Order}${id}`, {}, decrypted_access_token);
            const data = response.data;
            
            get_purchase_orders(approvalType);
            setCloseDialog(false);
            toast.success(data.message);
        } catch (error) {
            console.error('Closing Error: ', error);
            throw error;
        }
    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        switch (name) {
            case 'documents':
                const file = files[0];
                validate_file(
                    file,
                    'file',
                    name,
                    setFormData,
                    setFormDataError,
                    setFormDataHelperText
                );
                break;
            case 'supplier_id':
                setData(setFormData, name, value);
                if (!nullCheck(value)) {
                    get_supplier_products(value);
                    setErrorOnly(setFormDataError, name, false);
                } else {
                    setProducts([]);
                    setErrorOnly(setFormDataError, name, true);
                }
                break;
            case 'product_id':
                setData(setFormData, name, value);
                const selected_product = products.find((product) => product.id === value);
                if (!nullCheck(value)) {
                    setErrorOnly(setFormDataError, name, false);
                    if (selected_product) {
                        setProductPrice(selected_product.price);
                    }
                }
                break;
            case 'unit_price':
                setData(setFormData, name, value);
                const modifiedString = name.replace(/_/, ' ');
                if (decimalNumRegex(value)) {
                    const numericValue = parseFloat(value);

                    if (numericValue === '') {
                        setErrorHelper(name, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                    } else if (numericValue <= 0 || isNaN(numericValue)) {
                        setErrorHelper(name, true, `${firstCap(modifiedString)} must be a valid number and greater than zero!`, setFormDataError, setFormDataHelperText);
                    } else if (numericValue >= productPrice) {
                        setErrorHelper(name, true, `${firstCap(modifiedString)} must be less than the price of the chosen product`, setFormDataError, setFormDataHelperText);
                    } else {
                        if (!nullCheck(formData?.quantity) && !nullCheck(formData?.discount)) {
                            const subtot = calculateSubtotal(value, formData?.quantity);
                            const discounted_subtotal = calculateDiscountSubtotal(subtot, formData?.discount);
                            const taxAmount = calculateTaxAmnt(discounted_subtotal, formData?.tax_rate);
                            const totalAmnt = calculateTotalAmnt(discounted_subtotal, taxAmount);

                            setData(setFormData, 'subtotal', discounted_subtotal);
                            setData(setFormData, 'tax_amount', taxAmount);
                            setData(setFormData, 'total', totalAmnt);
                        }
                        setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                    }
                } else {
                    setErrorHelper(name, true, `${firstCap(modifiedString)} must be a valid number or a valid decimal number`, setFormDataError, setFormDataHelperText);
                }
                break;
            case 'quantity':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                } else if (!wholeNumRegex(value) || isNaN(value)) {
                    setErrorHelper(name, true, `${firstCap(name)} must be a valid number and greater than zero`, setFormDataError, setFormDataHelperText);
                } else {
                    if (!nullCheck(formData?.unit_price) && !nullCheck(formData?.discount)) {
                        const subtot = calculateSubtotal(formData?.unit_price, value);
                        const discounted_subtotal = calculateDiscountSubtotal(subtot, formData?.discount);
                        const taxAmount = calculateTaxAmnt(discounted_subtotal, formData?.tax_rate);
                        const totalAmnt = calculateTotalAmnt(discounted_subtotal, taxAmount);
    
                        setData(setFormData, 'subtotal', discounted_subtotal);
                        setData(setFormData, 'tax_amount', taxAmount);
                        setData(setFormData, 'total', totalAmnt);
                    }
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'discount':
                setData(setFormData, name, value);
                if (!nullCheck(formData?.unit_price) && !nullCheck(formData?.quantity)) {
                    const subtot = calculateSubtotal(formData?.unit_price, formData?.quantity);
                    const discounted_subtotal = calculateDiscountSubtotal(subtot, value);
                    const taxAmount = calculateTaxAmnt(discounted_subtotal, formData?.tax_rate);
                    const totalAmnt = calculateTotalAmnt(discounted_subtotal, taxAmount);
    
                    setData(setFormData, 'subtotal', discounted_subtotal);
                    setData(setFormData, 'tax_amount', taxAmount);
                    setData(setFormData, 'total', totalAmnt);
                }
                break;
            default:
                setData(setFormData, name, value);
                if (name !== 'additional_charges' || name !== 'po_notes') {
                    if (nullCheck(value)) {
                        setErrorHelper(name, true, 'Please fill up required field', setFormDataError, setFormDataHelperText);
                    } else {
                        setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                    }
                }
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataSubmit = new FormData();
        const excluded = ['documents_name', 'shipping_date']; // do not include shipping, will update upon approval
        for (const field in formData) {
            if (!excluded.includes(field)) {
                formDataSubmit.append(field, formData[field]);
            }
        }
        
        const optional = ['additional_charges', 'po_notes'];
        const optional_update = ['documents', 'documents_name'];
        let hasError = false;

        for (const field in formData) {
            const isFieldEmpty = nullCheck(formData[field]);
            const isFieldError = formDataError[field] === true;
            const isOptional = optional.includes(field);
            const isOptionalUpdate = optional_update.includes(field);

            if (editIndex === 1) {
                if (!isOptional && !isOptionalUpdate && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                }
            } else if (editIndex === 0) {
                if (!isOptional && (isFieldEmpty && isFieldError)) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required field!', setFormDataError, setFormDataHelperText);
                }
            }
        }

        if (hasError) {
            toast.error('Oops, something went wrong. Please check for incorrect or empty fields!');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_post_header_file(`${update_Purchase_order}${formData.po_number}`, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    setApprovalType(0);
                    get_purchase_orders(0);
                    toast.success(response.data.message);
                })
                .catch(error => {
                    console.error('Update Error: ', error);
                    toast.error('Oops, something went wrong. Please try again later.');
                    setLoading(false);
                });
            } else {
                axios_post_header_file(add_Purchase_order, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    setApprovalType(0)
                    get_purchase_orders(0);
                    toast.success(response.data.message);
                })
                .catch(error => {
                    console.error('Create error: ', error);
                    toast.error('Oops, something went wrong. Please try again later.');
                    setLoading(false);
                });
            }
        }
    }

    return (
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />
            {/* add and edit dialog */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>{ editIndex === 1 ? 'Update' : 'New'} Purchase Order</DialogTitle>
                <Divider sx={{ mt: -1.5 }}>
                    <Typography variant="body1">Primary Information</Typography>
                </Divider>
                <DialogContent>
                    <AddUpdateContent
                        formData={formData}
                        formDataError={formDataError}
                        formDataHelpertext={formDataHelpertext}
                        handleChange={handleChange}
                        suppliers={suppliers}
                        products={products}
                        warehouse={warehouse}
                        editIndex={editIndex}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={loading && editIndex === 1
                                ? 'Updating Purchase Order'
                                : (!loading && editIndex === 1
                                ? 'Update Purchase Order'
                                : (loading && editIndex === 0
                                ? 'Creating new Purchase Order'
                                : (!loading && editIndex === 0
                                ? 'Create New Purchase Order'
                                : '')))}
                                endIcon={<AddShoppingCartOutlined />}
                                onClick={handleSubmit}
                                loading={loading}
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

            {/* flagged as close - dialog */}
            <CloseOrder
                close_order={close_order}
                closeDialog={closeDialog}
                setCloseDialog={setCloseDialog}
                loading={loading}
                id={formData?.id}
            />

            {/* table buttons */}
            <Grid container justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={ crumbsHelper('Purchase Order', 'Inventory', '../inventory') } />
                </Grid>
                <Grid item lg={9} xl={9} md={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item>
                            <SelectCmp
                                size="small"
                                id="approval-type"
                                items={approval_list}
                                value={approvalType}
                                name="approval_status"
                                onChange={handleApprovalTypeChange}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" endIcon={<RefreshOutlined />} onClick={refresh_table}>Refresh Table</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" endIcon={<AddShoppingCartOutlined />} onClick={() => handleDialog(true)}>New Purhase Order</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <TableComponent columns={columns} rows={rows} loadingTable={loadingTable} sx={{ mb: 5 }} />
        </Grid>
    );
}

export default PurchaseOrder;