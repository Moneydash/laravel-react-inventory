import { AttachmentOutlined } from "@mui/icons-material";
import { Divider, Grid, TextField, Typography } from "@mui/material";
import { DatePickerCmp, SelectCmp } from "components/elements/FieldComponents";
import FileUploadCmp from "components/elements/FileUploadComponent";
import dayjs from "dayjs";
import React from "react";
import { nullCheck } from "utils/helper";

const AddUpdateContent = ({
    formData,
    formDataError,
    formDataHelpertext,
    handleChange,
    suppliers,
    products,
    warehouse,
    editIndex,
    approvalStatus,
    readOnly
}) => {
    const prio_lvl = [
        { id: '3', name: 'Low' },
        { id: '2', name: 'Medium' },
        { id: '1', name: 'High' }
    ];
    const ship_method = [
        { id: 'standard', name: 'Standard Shipping Method' },
        { id: 'express', name: 'Express Shipping Method' }
    ];
    const discount_rate = [
        { id: 0, name: 'No Discount' },
        { id: 10, name: '10% Discount' },
        { id: 25, name: '25% Discount' },
        { id: 50, name: '50% Discount' },
        { id: 75, name: '75% Discount' },
    ]; // temporarily hard coded, will also add to configurations later.
    return (
        <div>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mb: 3 }}>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="PO Number"
                        placeholder="Purchase Order Number (Required)"
                        size="small"
                        fullWidth
                        value={formData?.po_number}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid
                    item
                    xl={formData?.supplier_id !== '' ? 4 : 8}
                    lg={formData?.supplier_id !== '' ? 4 : 8}
                    md={formData?.supplier_id !== '' ? 4 : 8}
                    sm={6}
                    xs={12}
                >
                    <SelectCmp
                        id="supplier-id"
                        items={suppliers}
                        size="small"
                        name="supplier_id"
                        noItemsText="No Suppliers yet ..."
                        label="Suppliers"
                        value={formData?.supplier_id}
                        error={formDataError.supplier_id}
                        onChange={handleChange}
                        readOnly={readOnly}
                    />
                </Grid>
                { formData?.supplier_id !== ''
                ? (
                    <Grid item xl={4} lg={4} md={4} sm={6} xs={4}>
                        <SelectCmp
                            id="product-id"
                            items={products}
                            size="small"
                            name="product_id"
                            noItemsText="No products yet ..."
                            label="Products"
                            value={formData?.product_id}
                            error={formDataError?.product_id}
                            onChange={handleChange}
                            readOnly={readOnly}
                        />
                    </Grid>
                )
                : ''}
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Price"
                        placeholder="Unit Price of the purchase (Required)"
                        size="small"
                        fullWidth
                        value={formData?.unit_price}
                        error={formDataError?.unit_price}
                        helperText={formDataHelpertext?.unit_price}
                        onChange={handleChange}
                        name="unit_price"
                        InputProps={{ readOnly: nullCheck(formData?.product_id) || readOnly }}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Quantity"
                        placeholder="Quantity of the Purchase (Required)"
                        size="small"
                        fullWidth
                        value={formData?.quantity}
                        error={formDataError?.quantity}
                        helperText={formDataHelpertext?.quantity}
                        onChange={handleChange}
                        name="quantity"
                        InputProps={{ readOnly: nullCheck(formData?.product_id) || readOnly }}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <SelectCmp
                        id="discount"
                        label="Discount"
                        items={discount_rate}
                        size="small"
                        noItemsText="No Discount choices yet ..."
                        value={formData?.discount}
                        error={formDataError?.discount}
                        name="discount"
                        onChange={handleChange}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Subtotal"
                        placeholder="Subtotal of the Purchase (Autofilled)"
                        size="small" 
                        fullWidth
                        value={formData?.subtotal}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Tax rate"
                        placeholder="Tax rate of the Purchase (Required)"
                        size="small"
                        fullWidth
                        value={formData?.tax_rate}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Tax amount"
                        placeholder="Tax amount of the Purchase (Autofilled)"
                        size="small"
                        fullWidth
                        value={formData?.tax_amount}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12} sx={{ mt: editIndex === 0 ? 0 : -1 }}>
                    { editIndex === 0 || approvalStatus === 0
                    ? (<TextField
                        label="Shipping Date"
                        size="small"
                        fullWidth
                        value={formData?.shipping_date}
                        disabled
                    />)
                    : (<DatePickerCmp
                        label="Shipping Date"
                        name="shipping_date"
                        size="small"
                        readOnly={true}
                        value={dayjs()}
                    />)}
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <SelectCmp
                        id="shipping-method"
                        label="Shipping Method"
                        items={ship_method}
                        size="small"
                        name="shipping_method"
                        noItemsText="No Shipping Method ..."
                        value={formData?.shipping_method}
                        error={formDataError?.shipping_method}
                        onChange={handleChange}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
                    <TextField
                        label="Total amount"
                        placeholder="Total Amount of the Purchase (Autofilled)"
                        size="small"
                        fullWidth
                        value={formData?.total}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>
            <Divider variant="middle"><Typography variant="body1">Additional Information</Typography></Divider>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5 }}>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <TextField
                        label="Additional Charges"
                        name="additional_charges"
                        placeholder="Additional Charges of the purchase (Optional)"
                        size="small"
                        fullWidth
                        value={formData?.additional_charges}
                        onChange={handleChange}
                        InputProps={{ readOnly: readOnly }}
                    />
                </Grid>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <FileUploadCmp
                        name="documents"
                        fileName="documents_name"
                        placeholder="Supporting Documents (Required)"
                        accept=".pdf, .docx, .doc"
                        endIcon={<AttachmentOutlined />}
                        size="small"
                        fileNameValue={formData?.documents_name}
                        fileNameError={formDataError?.documents_name}
                        fileNameHelperText={formDataHelpertext?.documents_name}
                        handleChange={handleChange}
                        disabled={readOnly}
                    />
                </Grid>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <TextField
                        label="Billing Address"
                        name="billing_address"
                        placeholder="Billing of the purchase (Required)"
                        size="small"
                        fullWidth
                        value="Comembo, Makati City" // temporarily hard coded
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <SelectCmp
                        id="warehouse-id"
                        label="Delivery Warehouse"
                        items={warehouse}
                        size="small"
                        name="warehouse_id"
                        noItemsText="No warehouses yet ..."
                        value={formData?.warehouse_id}
                        error={formDataError?.warehouse_id}
                        onChange={handleChange}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <SelectCmp
                        id="priority-lvl"
                        label="Priority Level"
                        items={prio_lvl}
                        size="small"
                        name="priority_lvl"
                        value={formData?.priority_lvl}
                        error={formDataError?.priority_lvl}
                        onChange={handleChange}
                        readOnly={readOnly}
                    />
                </Grid>
                <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
                    <TextField
                        label="Tracking Number"
                        name="tracking_num"
                        placeholder="Tracking Number of the purchases (Required)"
                        size="small"
                        value={formData?.tracking_num}
                        fullWidth
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                    <TextField
                        label="Purchase Notes"
                        name="po_notes"
                        placeholder="Special Handling Notes (Optional)"
                        size="small"
                        fullWidth
                        minRows={3}
                        maxRows={8}
                        multiline
                        value={formData?.po_notes}
                        onChange={handleChange}
                        InputProps={{ readOnly: readOnly }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default AddUpdateContent;