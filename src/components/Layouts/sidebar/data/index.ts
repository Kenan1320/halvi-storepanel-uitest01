import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: []
      },
      {
        title: "Access Control",
        icon: Icons.AccessControl,
        items: [{
          title: "Roles",
          url: "/access-control/roles",
        },
        {
          title: "Staffs",
          url: "/access-control/staff",
        },],
      },
      {
        title: "My Store",
        url: "/store",
        icon: Icons.stores,
        items: [],
      },
      {
        title: "Products",
        icon: Icons.items,
        url: "/products",
        items: [],
      },
      {
        title: "Orders",
        icon: Icons.orders,
        url:"/orders",
        items: [],
      },
      {
        title: "Payments",
        url: "/payments",
        icon: Icons.payments,
        items: [],
      },
     
    ],
  }
];
