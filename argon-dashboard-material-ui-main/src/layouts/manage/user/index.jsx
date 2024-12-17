import { Box, Grid, Pagination } from '@mui/material'

import ProfileCard from 'components/ArgonCardUser';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import React from 'react'
import AccountService from 'services/AccountServices';

const UserInfo = function () {
    const [items, setItem] = React.useState([])
    const [page, setPage] = React.useState(1);
    const itemsPerPage = 9;

    React.useEffect(() => {
        const fecthData = async () => {
            try {
                const resp = await AccountService.getAllAccounts();
                setItem(resp.data);
            } catch (err) { console.log(err); }
        }

        fecthData();
    }, [])

    const currentItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={2}>
                {currentItems
                    .filter((account) => account.roleName?.some((role) => role.name === "USER"))
                    .map((item, index) => (
                        <Grid item xs={4} key={index}>
                            <ProfileCard account={item} />
                        </Grid>
                    ))}
            </Grid>
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={Math.ceil(items.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </DashboardLayout>
    )
}

export default UserInfo;