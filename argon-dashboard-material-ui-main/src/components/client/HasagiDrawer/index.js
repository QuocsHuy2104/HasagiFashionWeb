import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import Slider from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FavoriteService from "services/FavoriteServices";
import { isAuthenticated } from "utils/Authen";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonButton from "components/ArgonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBitcoin } from "react-icons/fa";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function BottomDrawerWithHeight() {
  const [items, setItems] = React.useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => setIsDrawerOpen(open);

  const getFavorite = async () => {
    try {
      const resp = await FavoriteService.getByAccount();
      setItems(resp.data);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) getFavorite();
  }, []);

  const onRemove = () => {
    alert('Remove')
  }

  const handleAddToCart = () => {

  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow({ className, onClick }) {
    return (
      <IconButton
        className={className}
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "40%",
          right: "-35px",
          zIndex: 2,
          backgroundColor: "#f8f9fa",
          "&:hover": { backgroundColor: "#ddd" },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  }

  function PrevArrow({ className, onClick }) {
    return (
      <IconButton
        className={className}
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "40%",
          left: "-35px",
          zIndex: 2,
          backgroundColor: "#f8f9fa",
          "&:hover": { backgroundColor: "#ddd" },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
    );
  }

  NextArrow.propTypes = PrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
  };

  const drawerContent = (
    <Box sx={{ width: "100%", height: "100%", }}>
      <ArgonBox display="flex" justifyContent="start" bgColor="warning" variant="gradient">
        <ArgonTypography color="white" variant="h3" px={20}>
          Danh mục sản phẩm yêu thích
        </ArgonTypography>
      </ArgonBox>
      <ArgonBox px={20}>
        {items.length > 0 ?
          <ArgonBox py={2}>
            <ArgonBox mt={3} mb={3} sx={{ width: "95%", margin: "0 auto" }}>
              <Slider {...settings}>
                {
                  items.map((product) => (
                    <ArgonBox
                      key={product.id}
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <ArgonBox>
                        <ArgonAvatar
                          src={product.image ? product.image : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930"}
                          alt={product.name}
                          variant="rounded"
                          size="xl"
                        />
                      </ArgonBox>

                      <ArgonBox
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        flexGrow={1}
                        mt={1}
                      >
                        <ArgonTypography variant="button">{product.name}</ArgonTypography>
                        {product.sale == 0 ? (
                          <ArgonTypography variant="button" color="error">
                            {product.price}
                          </ArgonTypography>
                        ) : (
                          <ArgonBox display="flex" justifyContent='start' alignItems="flex-start">
                            <ArgonTypography variant="button" color="error">
                              {product.price}
                            </ArgonTypography>
                            <ArgonTypography
                              variant="button"
                              color="secondary"
                              sx={{ textDecoration: "line-through" }}
                              mx='12px'
                            >
                              {product.price}
                            </ArgonTypography>
                            <ArgonTypography variant="caption" color="error">
                              (- {product.sale}%)
                            </ArgonTypography>
                          </ArgonBox>

                        )}
                        <ArgonBox mt={2} display='flex' justifyContent='start' sx={{ gap: 2 }}>
                          <ArgonButton variant="outlined" color="warning" onClick={handleAddToCart}>
                            Thêm vào giỏ hàng
                          </ArgonButton>

                          <ArgonBox onClick={onRemove} sx={{ cursor: "pointer" }}>
                            <FontAwesomeIcon icon={faTrash} />
                          </ArgonBox>
                        </ArgonBox>

                      </ArgonBox>
                    </ArgonBox>

                  ))
                }
              </Slider>
            </ArgonBox>
          </ArgonBox>
          :
          <ArgonTypography variant='button'>Không có sản phẩm yêu thích</ArgonTypography>
        }
      </ArgonBox>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        Mở Drawer
      </Button>

      <SwipeableDrawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            height: 'auto',
            borderRadius: "16px 16px 0 0",
            margin: 0,
          },
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    </div>
  );
}
