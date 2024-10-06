import React, { useState, useEffect } from 'react';
import useDebounce from 'hooks/useDebounce';
import { axios_get_header } from 'utils/requests';
import { get_Audit_Trails, get_Audit_Trail } from 'utils/services';
import { decryptAccessToken } from 'utils/auth';
import TableComponentV2 from 'components/elements/Tables/TableComponentV2';
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import BreadCrumbsCmp from 'components/elements/BreadcrumbsComponent';
import { crumbsHelper, isoDateToCommonDateTime } from 'utils/helper';
import { ErrorColorBtn, PrimaryColorBtn, PrimaryColorIconBtn } from 'components/elements/ButtonsComponent';
import { CancelOutlined, RefreshOutlined, Visibility } from '@mui/icons-material';

function AuditTrail() {
    document.title = 'InventoryIQ: System Logs';
    const decrypted_access_token = decryptAccessToken();
    const renderActionButtons = (params) => {
        return (
            <PrimaryColorIconBtn
                title="View"
                icon={<Visibility fontSize="small"/>}
                fn={() => get_audit_trail(params.value)}
            />
        )
    }
    const [rows, setRows] = useState([]);
    const columns = [
        { field: 'user_id', headerName: 'User ID', flex: 1, valueGetter: (params) => params.row.user.email },
        { field: 'action', headerName: 'Action', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'created_at', headerName: 'Created At', flex: 1, valueGetter: (params) => isoDateToCommonDateTime(params.row.created_at) },
        { field: 'id', headerName: 'View', flex: 1, renderCell: renderActionButtons }
    ];
    const [loading, setLoading] = useState(false);
    const [auditTrail, setAuditTrail] = useState([]);

    const [open, setOpen] = useState(false);

    // pagination
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);
    
    useEffect(() => {
        setLoading(true);
        axios_get_header(
            `${get_Audit_Trails}?page=${currentPage}&per_page=${rowsPerPage}&search=${debounceSearch}`,
            decrypted_access_token
        ).then(response => {
            const data = response.data;
            setRows(data.data);
            setMaxPage(data.last_page);
            setLoading(false);
        }).catch(error => {
            console.error('Error: ', error);
            setLoading(false);
        });
    }, [currentPage, rowsPerPage, debounceSearch]);

    const get_audit_trails = async () => {
        setLoading(true);
        await axios_get_header(
            `${get_Audit_Trails}?page=1&per_page=10&search=`,
            decrypted_access_token
        ).then(response => {
            const data = response.data;
            setRows(data.data);
            setMaxPage(data.last_page);
            setLoading(false);
        }).catch(error => {
            console.error('Error: ', error);
            setLoading(false);
        });
    }

    const get_audit_trail = async (id) => {
        setOpen(true);
        await axios_get_header(
            `${get_Audit_Trail}${id}`,
            decrypted_access_token
        ).then(response => {
            const trail_data = response.data;
            setAuditTrail(trail_data);
        }).catch(error => {
            console.error('Error: ', error);
        });
    }
    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>
                    Audit Trail Details
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContent>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={1.5} sx={{ mt: -3 }}>
                            <Grid item xs={12}>
                                <span><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>User ID:</span> {auditTrail?.user?.email ?? 'N/A'}</Typography></span>
                            </Grid>
                            <Grid item xs={12}>
                                <span><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Action:</span> {auditTrail?.action ?? 'N/A'}</Typography></span>
                            </Grid>
                            <Grid item xs={12}>
                                <span><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Description:</span> {auditTrail?.description ?? 'N/A'}</Typography></span>
                            </Grid>
                            <Grid item xs={12}>
                                <span><Typography variant="body1"><span style={{ fontWeight: 'bold' }}>Created At:</span> {isoDateToCommonDateTime(auditTrail?.created_at ?? 'N/A')}</Typography></span>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" display="flex" justifyContent="flex-end" alignItems="center" sx={{ mr: 1, mb: 1 }}>
                    <ErrorColorBtn displayText="Close" onClick={() => setOpen(false)} endIcon={<CancelOutlined fontSize="small"/>} />
                    </Grid>
                </DialogActions>
            </Dialog>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('', 'System Logs', '')} />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="end" display="flex">
                            <PrimaryColorBtn displayText="Refresh Table" endIcon={<RefreshOutlined fontSize="small"/>} onClick={get_audit_trails} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <TableComponentV2
                columns={columns}
                rows={rows}
                loadingTable={loading}
                size={rowsPerPage}
                setSize={setRowsPerPage}
                page={currentPage}
                setPage={setCurrentPage}
                total={maxPage}
                search={search}
                setSearch={setSearch}
                sx={{ mb: 5 }}
            />
        </Grid>
    );
}

export default AuditTrail;