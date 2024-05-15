const ecommerceNav = [
    {
        path: "/getstarted",
        title: "Get Started",
        icon: "RxDashboard",
    },
    {
        path: "/dashboard",
        title: "Dashboard",
        icon: "RxDashboard",
    },
    {
        path: "/products",
        title: "Products",
        icon: "TbMotorbike",
    },
    {
        path: "/inventory",
        title: "Inventory",
        icon: "GrBusinessService",
    },
    {
        path: "/categories",
        title: "Categories",
        icon: "TbCategory",
    },
    {
        path: "/orders",
        title: "Orders",
        icon: "TbTruckDelivery",
        submenu: [
            { path: "/orders/list", title: "List" },
            { path: "/orders/dispute", title: "Dispute" },
        ],
    },
    { path: "/customers", title: "Customers", icon: "IoPeopleOutline" },
    {
        path: "/setups",
        title: "Setups",
        icon: "MdWifiProtectedSetup",
        submenu: [
            {
                path: "/setups/content",
                title: "Content",
            },
            {
                path: "/setups/policy-wizard",
                title: "Policy Wizard",
            },
            {
                path: "/setups/theme",
                title: "Theme",
            },
        ],
    },
    {
        path: "/promotions",
        title: "Promotions",
        icon: "MdPayment",
        submenu: [
            // {
            //     path: "/promotions",
            //     title: "Internal",
            // },
            {
                path: "/promotions/ads",
                title: "Ads",
            },
        ],
    },
    {
        path: "/billing",
        title: "Billing",
        icon: "MdOutlinePayment",
    },
    {
        path: "/settings",
        title: "Settings",
        icon: "AiOutlineSetting",
    },
]

const serviceNav = [
    {
        path: "/getstarted",
        title: "Get Started",
        icon: "RxDashboard",
    },
    {
        path: "/dashboard",
        title: "Dashboard",
        icon: "RxDashboard",
    },
    {
        path: "/services",
        title: "Service Items",
        icon: "GrBusinessService",
        submenu: [
            {
                path: "/services",
                title: "Service Items",
            },
            {
                path: "/services/orders",
                title: "Orders",
            },
        ],
    },
    {
        path: "/calender",
        title: "Calender",
        icon: "GrBusinessService",
    },
    {
        path: "/board",
        title: "Board",
        icon: "HiViewBoards",
    },
    {
        path: "/setups",
        title: "Setups",
        icon: "MdWifiProtectedSetup",
        submenu: [
            {
                path: "/setups/content",
                title: "Content",
            },
            {
                path: "/setups/theme",
                title: "Theme",
            },
        ],
    },
    {
        path: "/promotions",
        title: "Promotions",
        icon: "MdPayment",
        submenu: [
            // {
            //     path: "/promotions",
            //     title: "Internal",
            // },
            {
                path: "/promotions/ads",
                title: "Ads",
            },
        ],
    },
    {
        path: "/billing",
        title: "Billing",
        icon: "MdOutlinePayment",
    },
    {
        path: "/settings",
        title: "Settings",
        icon: "AiOutlineSetting",
    },
]

module.exports = {
    ecommerceNav,
    serviceNav
}