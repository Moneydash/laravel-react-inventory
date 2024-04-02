import { CancelOutlined, EditRounded, LayersTwoTone, RefreshOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { inventoryCrumbs } from "utils/breadCrumbs";
import { DataGrid } from "@mui/x-data-grid";
import { axios_get_header, axios_post_header, axios_put_header } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import ToastCmp from "components/elements/ToastComponent";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import {
    get_Categories,
    get_Category,
    update_Category,
    add_Category
} from 'utils/services';

function Category() {
    document.title = 'Inventory IQ: Categories';
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const columns = [
        { field: 'category_name', headerName: 'Category Name', flex: 1 },
        { field: 'slug', headerName: 'Slug', flex: 1 },
        { field: 'category_description', headerName: 'Description', flex: 1 },
        { field: 'id', headerName: 'Action', width: 100, renderCell: (params) => (
            <div>
                <IconButton onClick={() => get_category(params.value)} color="primary">
                    <Tooltip arrow title="Update Category"><EditRounded fontSize="small" /></Tooltip>
                </IconButton>
            </div>
        )}
    ];

    const initialForm = {
        id: '',
        category_name: '',
        slug: '',
        category_description: ''
    };
    const initialFormError = {
        category_name: false,
        slug: false
    };
    const initialFormHelper = {
        category_name: '',
        slug: ''
    };

    const [rows, setRows] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState(initialFormError);
    const [formHelper, setFormHelper] = useState(initialFormHelper);
    const [dialog, setDialog] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const get_categories = async () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header(get_Categories, decrypt_access_token)
        .then(response => {
            const data = response.data;
            setRows(data.categories);
            setLoadingTable(false);
        }).catch(error => {
            console.error('Error: ', error);
            toast.error(try_again);
            setLoading(false);
        });
    }

    /* eslint-disable */
    useEffect(() => {
        get_categories();
    }, []);
    /* eslint-disable */

    const toggleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            setForm(initialForm);
            setFormError(initialFormError);
            setFormHelper(initialFormHelper);
            setEditIndex(0);
        }
    }

    const get_category = async (id) => {
        await axios_get_header(`${get_Category}${id}`, decrypt_access_token)
        .then(response => {
            const data = response.data;
            const category = data.category;
            setEditIndex(1);
            setForm((prevState) => ({
                ...prevState,
                id: category.id,
                category_name: category.category_name,
                slug: category.slug,
                category_description: category.category_description
            }));
            toggleDialog(true);
        })
        .catch(error => {
            console.error('Error: ', error);
            toast.error(try_again);
        });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prevState) => ({ ...prevState, [name]: value }));

        if (name === 'category_name' || name === 'slug') {
            if (value === '') {
                setFormError((prevError) => ({ ...prevError, [name]: true }));
                setFormHelper((prevText) => ({ ...prevText, [name]: 'Please fill up required field!'}));
            } else {
                setFormError((prevError) => ({ ...prevError, [name]: false }));
                setFormHelper((prevText) => ({ ...prevText, [name]: ''}));
            }
        }
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        let hasError = false;
        for (const field in form) {
            if (field !== 'id' && field !== 'category_description') {
                if (formError[field] === true || form[field] === '') {
                    hasError = true;
                    setFormError((prevError) => ({ ...prevError, [field]: true }));
                    setFormHelper((prevText) => ({ ...prevText, [field]: 'Please fill up required field!' }));
                } else {
                    hasError = false;
                    setFormError((prevError) => ({ ...prevError, [field]: false }));
                    setFormHelper((prevText) => ({ ...prevText, [field]: '' }));
                }
            }
        }

        if (hasError) {
            toast.error('Please check for errors or empty fields!');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                await axios_put_header(update_Category + form.id, form, decrypt_access_token)
                .then(response => {
                    setLoading(false);
                    const data = response.data;
                    toast.success(data.message);
                    toggleDialog(false);
                    get_categories();
                }).catch(error => {
                    console.error('Error: ', error);
                    toast.error(try_again);
                    setLoading(false);
                });
            } else {
                await axios_post_header(add_Category, form, decrypt_access_token)
                .then(response => {
                    setLoading(false);
                    const data = response.data;
                    toast.success(data.message);
                    toggleDialog(false);
                    get_categories();
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error: ', error);
                    toast.error(try_again);
                })
            }
        }
    };

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />
            <Dialog open={dialog} fullWidth maxWidth="sm">
                <DialogTitle>{ editIndex === 1 ? 'Update' : 'Add' } New Category</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container rowSpacing={2}>
                        <Grid item lg={12} xl={12} sm={12} xs={12}>
                            <TextField
                                label="Name"
                                placeholder="Category Name (Required)"
                                name="category_name"
                                value={form.category_name}
                                error={formError.category_name}
                                helperText={formHelper.category_name}
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={12} xl={12} sm={12} xs={12}>
                            <TextField
                                label="Slug"
                                placeholder="Slug (Required)"
                                name="slug"
                                value={form.slug}
                                error={formError.slug}
                                helperText={formHelper.slug}
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item lg={12} xl={12} sm={12} xs={12}>
                            <TextField
                                label="Description"
                                placeholder="Category Description (Optional)"
                                name="category_description"
                                value={form.category_description}
                                fullWidth
                                multiline
                                minRows={3}
                                maxRows={8}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <LoadingButton loading={loading} variant="contained" loadingPosition="end" color="primary" endIcon={<LayersTwoTone fontSize="small" />} onClick={handleSubmit}>
                                { loading && editIndex === 1 ? 'Updating'
                                : (editIndex === 0 && loading ? 'Adding'
                                : (editIndex === 1 && !loading ? 'Update'
                                : 'Add'))
                                } Category
                            </LoadingButton>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined fontSize="small" />} onClick={() => toggleDialog(false)}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            {/* table buttons */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={inventoryCrumbs('Categories')} />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                    <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" onClick={get_categories} endIcon={<RefreshOutlined fontSize="small" />}>Refresh Table</Button>
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" onClick={() => toggleDialog(true)} endIcon={<LayersTwoTone fontSize="small" />}>Add New Category</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* table definitions */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <Card raised sx={{ width: '100%', mr: 2 }}>
                        <CardContent>
                            <DataGrid rows={rows} columns={columns} loading={loadingTable} autoHeight/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Category;