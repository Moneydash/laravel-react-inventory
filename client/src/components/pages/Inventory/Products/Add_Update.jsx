import React from "react"
import {
    Grid,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import { AttachmentOutlined } from "@mui/icons-material";
import FileUploadCmp from "components/elements/FileUploadComponent";
import { MultipleSelectCmp, SelectCmp } from "components/elements/FieldComponents";
import { nullCheck } from "utils/helper";

const AddUpdateContent = ({
    formData,
    formDataError,
    formDataHelperText,
    handleChange,
    categories,
    warehouses,
    suppliers,
    parentProducts,
    imgSrc
}) => {
    const boolChoices = [
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' }
    ];

    const imgPreview = () => {
        if (nullCheck(imgSrc)) {
            return null; // or any other fallback content if needed
        }
    
        return (
            <img
                src={imgSrc}
                alt="Preview"
                style={{
                    height: '100px',
                    width: '100px',
                    border: '1px dashed #ccc',
                    borderRadius: '50%',
                    marginTop: '-.5rem',
                    padding: '5px'
                }}
            />
        );
    };

    return (
        <div>
            {/* { imgPreview() } */}
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mb: 3 }}>
                <Grid item lg={12} xl={12} md={12} sm={12} xs={12}>
                    <Grid container direction="row" justifyContent="center">
                        { imgPreview() }
                    </Grid>
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <TextField
                        name="name"
                        label="Name"
                        placeholder="Name of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.name}
                        error={formDataError.name}
                        helperText={formDataHelperText.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <FileUploadCmp
                        name="image"
                        fileName="image_name"
                        fileNameError={formDataError.image_name}
                        fileNameHelperText={formDataHelperText.image_name}
                        fileNameValue={formData.image_name}
                        accept=".png, .jpg, .jpeg, .gif"
                        endIcon={<AttachmentOutlined />}
                        size="small"
                        placeholder="Image of the Product (Required)"
                        handleChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <TextField
                        name="price"
                        label="Price"
                        placeholder="Price of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.price}
                        error={formDataError.price}
                        helperText={formDataHelperText.price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <TextField
                        name="sku"
                        label="SKU"
                        placeholder="SKU of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.sku}
                        error={formDataError.sku}
                        helperText={formDataHelperText.sku}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <TextField
                        name="barcode"
                        label="Barcode"
                        placeholder="Barcode of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.barcode}
                        error={formDataError.barcode}
                        helperText={formDataHelperText.barcode}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={12}>
                    <TextField
                        name="stocks"
                        label="Stocks"
                        placeholder="Acquired Product Stocks (Required)"
                        size="small"
                        fullWidth
                        value={formData.stocks}
                        error={formDataError.stocks}
                        helperText={formDataHelperText.stocks}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Divider variant="middle"><Typography variant="body1">Additional Information</Typography></Divider>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5 }}>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <SelectCmp
                        id="category-id"
                        label="Category"
                        items={categories}
                        name="category_id"
                        size="small"
                        value={formData.category_id}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <SelectCmp
                        id="warehouse-id"
                        label="Warehouse"
                        items={warehouses}
                        name="warehouse_id"
                        size="small"
                        value={formData.warehouse_id}
                        onChange={handleChange}
                        noItemsText={warehouses?.length > 0 || nullCheck(formData?.category_id) ? 'Select Categories first ...' : 'No Available Warehouse ...'}
                    />
                </Grid>
                <Grid
                    item
                    lg={formData.is_variant === 0 ? 12 : 6}
                    xl={formData.is_variant === 0 ? 12 : 6}
                    sm={formData.is_variant === 0 ? 12 : 6}
                    xs={12}
                >
                    <SelectCmp
                        id="is-variant"
                        label="Is Variant"
                        items={boolChoices}
                        name="is_variant"
                        size="small"
                        value={formData.is_variant}
                        onChange={handleChange}
                    />
                </Grid>
                {formData.is_variant === 1 ? (
                    <Grid item lg={6} xl={6} sm={6} xs={12}>
                        <SelectCmp
                            id="parent-product-id"
                            label="Parent Products"
                            items={parentProducts}
                            name="parent_product_id"
                            size="small"
                            value={formData.parent_product_id}
                            error={formDataError.parent_product_id}
                            onChange={handleChange}
                            noItemsText="No Parent Products yet ..."
                        />
                    </Grid>
                ) : ''}
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        name="weight"
                        label="Weight"
                        placeholder="Weight of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.weight}
                        error={formDataError.weight}
                        helperText={formDataHelperText.weight}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        name="dimensions"
                        label="Dimensions"
                        placeholder="Dimension of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.dimensions}
                        error={formDataError.dimensions}
                        helperText={formDataHelperText.dimensions}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid
                    item
                    lg={formData.has_serial === 0 ? 12 : 6}
                    xl={formData.has_serial === 0 ? 12 : 6}
                    sm={formData.has_serial === 0 ? 12 : 6}
                    xs={12}
                >
                    <SelectCmp
                        id="has-serial"
                        label="Has serial"
                        items={boolChoices}
                        name="has_serial"
                        size="small"
                        value={formData.has_serial}
                        onChange={handleChange}
                        error={formDataError.has_serial}
                    />
                </Grid>
                { formData.has_serial === 1
                ? (<Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        name="serial_number"
                        label="Serial Number"
                        placeholder="Serial Number of the Product (Required)"
                        size="small"
                        fullWidth
                        value={formData.serial_number}
                        error={formDataError.serial_number}
                        helperText={formDataHelperText.serial_number}
                        onChange={handleChange}
                    />
                </Grid>)
                : ''}
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        name="description"
                        label="Description"
                        placeholder="Description of the Product (Required)"
                        size="small"
                        minRows={2}
                        maxRows={6}
                        multiline
                        fullWidth
                        value={formData.description}
                        error={formDataError.description}
                        helperText={formDataHelperText.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        name="warranty_info"
                        label="Warranty"
                        placeholder="Warranty of the Product (Optional)"
                        size="small"
                        minRows={2}
                        maxRows={8}
                        multiline
                        fullWidth
                        value={formData.warranty_info}
                        error={formDataError.warranty_info}
                        helperText={formDataHelperText.warranty_info}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <MultipleSelectCmp
                        id="suppliers-id"
                        label="Suppliers"
                        items={suppliers}
                        size="small"
                        name="suppliers"
                        value={formData.suppliers}
                        error={formDataError.suppliers}
                        onChange={handleChange}
                        noItemsText={suppliers?.length > 0 ? 'Loading Suppliers...' : 'No Suppliers yet...'}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

AddUpdateContent.defaultProps = {
    formData: {},
    formDataError: {},
    formDataHelperText: {},
    handleChange: () => {},
    categories: [],
    warehouses: [],
    suppliers: [],
    parentProducts: []
}

export default AddUpdateContent;