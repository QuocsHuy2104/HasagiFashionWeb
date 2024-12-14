import React from 'react';
import ArgonBox from 'components/ArgonBox';
import ArgonTypography from 'components/ArgonTypography';
import { Grid, Avatar, Typography, Box } from "@mui/material";
import HomeService from 'services/HomeServices';
import { Link, useNavigate } from 'react-router-dom';

export default function ListCategories() {
    const [categories, setCategories] = React.useState([])
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await HomeService.getCategoryHeader();
                setCategories(res.data);
            } catch (e) {
                console.log(e)
            }
        }

        fetchData();
    }, [])

    return (
        <ArgonBox>
            <ArgonBox my={3}>
                <ArgonTypography variant='h3'>Danh Mục</ArgonTypography>
            </ArgonBox>

            <Box sx={{ p: (theme) => theme.spacing(4) }}>
                <Grid container spacing={3} justifyContent="center">
                    {categories.map((category, index) => (
                        <Grid item xs={12 / 7} key={index}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >

                                <Avatar
                                    alt={category.name}
                                    src={category.image}
                                    onError={(e) => {
                                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
                                    }}
                                    sx={{
                                        width: 133,
                                        height: 133,
                                        bgcolor: "#f5e5c8",
                                        mb: 1,
                                    }}

                                    onClick={(category) => {
                                        navigate('/Shop', { state: { category } })
                                    }}
                                />

                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                    {category.name}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ArgonBox>
    );
}
