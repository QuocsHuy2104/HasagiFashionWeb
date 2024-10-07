import React, { useEffect, useState } from 'react';

import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import DefaultBlogCard from 'examples/Cards/BlogCards';


import Grid from '@mui/material/Grid';
import HomeService from 'services/HomeServices';




function BestSeller() {

    const [pds, setPdds] = useState('');

    useEffect(async () => {
        const resp = await HomeService.getBetSeller();
        setPdds(resp.data || [])
    })

    return (
        <ArgonBox>
            <ArgonBox display='flex' justifyContent='space-between' alignItems='center' p={3}>
                <ArgonTypography variant='h6'>Sản Phẩm Bán Chạy</ArgonTypography>
            </ArgonBox>

            <ArgonBox>
                <Grid container spacing={4}>
                    {
                        pds.map((pd) => {
                            <Grid item xs key={pd.id}>
                                <DefaultBlogCard
                                    image={pd.image}
                                    title={pd.name}
                                    description={pd.description}
                                    action={{
                                        type: "internal",
                                        route: `/Shopdetail?id=${pd.id}`,
                                        color: "info",
                                        label: "Add to Cart"
                                    }}
                                />
                            </Grid>
                        })
                    }


                </Grid>
            </ArgonBox>
        </ArgonBox>
    );
}

export default BestSeller;