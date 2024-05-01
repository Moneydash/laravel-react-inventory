import {
    CancelOutlined,
    EditRounded,
    LayersTwoTone,
    RefreshOutlined
} from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { axios_get_header, axios_post_header, axios_put_header } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import ToastCmp from "components/elements/ToastComponent";
import { toast } from "react-toastify";
import {
    get_Categories,
    get_Category,
    update_Category,
    add_Category
} from 'utils/services';
import { ErrorColorBtn, PrimaryColorIconBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import { crumbsHelper, nullCheck, setErrorHelper } from "utils/helper";
import AddUpdateContent from "components/pages/Inventory/Category/Add_Update";
import TableComponent from "components/elements/TableComponent";

function Category() {
    document.title = 'Inventory IQ: Categories';
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const columns = [
        { field: 'name', headerName: 'Category Name', flex: 1 },
        { field: 'slug', headerName: 'Slug', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'id', headerName: 'Action', width: 100, renderCell: (params) => (
            <>
                <PrimaryColorIconBtn
                    fn={() => get_category(params.value)}
                    title="Update Category"
                    icon={<EditRounded fontSize="small"/>}
                />
            </>
        )}
    ];

    const initialForm = {
        id: '',
        name: '',
        slug: '',
        description: ''
    };
    const initialFormError = {
        name: false,
        slug: false
    };
    const initialFormHelper = {
        name: '',
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
        if (!open) {
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
                name: category.name,
                slug: category.slug,
                description: category.description
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

        if (name === 'name' || name === 'slug') {
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
            if (field !== 'id' && field !== 'description') {
                if (formError[field] === true || nullCheck(form[field])) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required field!', setFormError, setFormHelper);
                } else {
                    hasError = false;
                    setErrorHelper(field, false, '', setFormError, setFormHelper);
                }
            }
        }

        if (hasError) {
            toast.error('Oops, something went wrong. Please check any incorrect or empty fields.');
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
                    <AddUpdateContent
                        form={form}
                        formError={formError}
                        formHelper={formHelper}
                        handleChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={
                                    loading && editIndex === 1 ? 'Updating Category'
                                    : (editIndex === 0 && loading ? 'Adding Category'
                                    : (editIndex === 1 && !loading ? 'Update Category'
                                    : 'Add Category'))
                                }
                                endIcon={<LayersTwoTone fontSize="small"/>}
                                onClick={handleSubmit}
                                loading={loading}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined fontSize="small"/>}
                                onClick={() => toggleDialog(false)}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* table buttons */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('Category', 'Inventory', '../inventory')} />
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
            <TableComponent
                columns={columns}
                rows={rows}
                loadingTable={loadingTable}
                sx={{ mb: 5 }}
            />
        </Grid>
    );
}

export default Category;