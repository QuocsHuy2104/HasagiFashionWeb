/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import { Link } from "react-router-dom";
// import ArgonBadge from "components/ArgonBadge";

// // Images
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

// function Author({ image, name, email }) {
//   return (
//     <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
//       <ArgonBox mr={2}>
//         <ArgonAvatar src={image} alt={name} size="sm" variant="rounded" />
//       </ArgonBox>
//       <ArgonBox display="flex" flexDirection="column">
//         <ArgonTypography variant="button" fontWeight="medium">
//           {name}
//         </ArgonTypography>
//         <ArgonTypography variant="caption" color="secondary">
//           {email}
//         </ArgonTypography>
//       </ArgonBox>
//     </ArgonBox>
//   );
// }

// function Function({ job, org }) {
//   return (
//     <ArgonBox display="flex" flexDirection="column">
//       <ArgonTypography variant="caption" fontWeight="medium" color="text">
//         {job}
//       </ArgonTypography>
//       <ArgonTypography variant="caption" color="secondary">
//         {org}
//       </ArgonTypography>
//     </ArgonBox>
//   );
// }

const productTableData = {
  columns: [
    { name: "id", align: "center" },
    { name: "image", align: "left" },
    { name: "name", align: "center" },
    { name: "price", align: "center" },
    { name: "quantity", align: "center" },
    { name: "category", align: "center" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      id: 1,
      image: <img src="https://via.placeholder.com/50" alt="Product 1" />,
      name: "Product 1",
      price: "$10",
      quantity: 100,
      category: "Category A",
      action: (
        <ArgonTypography
          component={Link}
          to={`/manage/productdetail/1`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
    {
      id: 2,
      image: <img src="https://via.placeholder.com/50" alt="Product 2" />,
      name: "Product 2",
      price: "$20",
      quantity: 200,
      category: "Category B",
      action: (
        <ArgonTypography
          component={Link}
          to={`/productdetail/2`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
    {
      id: 3,
      image: <img src="https://via.placeholder.com/50" alt="Product 3" />,
      name: "Product 3",
      price: "$30",
      quantity: 300,
      category: "Category C",
      action: (
        <ArgonTypography
          component={Link}
          to={`/productdetail/3`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
    {
      id: 4,
      image: <img src="https://via.placeholder.com/50" alt="Product 4" />,
      name: "Product 4",
      price: "$40",
      quantity: 400,
      category: "Category D",
      action: (
        <ArgonTypography
          component={Link}
          to={`/productdetail/4`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
    {
      id: 5,
      image: <img src="https://via.placeholder.com/50" alt="Product 5" />,
      name: "Product 5",
      price: "$50",
      quantity: 500,
      category: "Category E",
      action: (
        <ArgonTypography
          component={Link}
          to={`/productdetail/5`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
    {
      id: 6,
      image: <img src="https://via.placeholder.com/50" alt="Product 6" />,
      name: "Product 6",
      price: "$60",
      quantity: 600,
      category: "Category F",
      action: (
        <ArgonTypography
          component={Link}
          to={`/productdetail/6`}
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Detail
        </ArgonTypography>
      ),
    },
  ],
};

export default productTableData;

