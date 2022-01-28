import { RemixiconReactIconComponentType } from 'remixicon-react';
import UsersIcon from 'remixicon-react/GroupLineIcon';
import OverviewIcon from 'remixicon-react/BarChartBoxLineIcon';
import FacilitiesIcon from 'remixicon-react/Home5LineIcon';
import OrdersIcon from 'remixicon-react/ShoppingCart2LineIcon';
import TransactionsIcon from 'remixicon-react/ExchangeFundsLineIcon';
import MessagesIcon from 'remixicon-react/MailOpenLineIcon';

export interface MenuItem{
    route: string,
    icon: RemixiconReactIconComponentType,
    display: string,
    countable?: boolean
}
export const MenuList: Array<MenuItem> = [
  {
    route: '/dashboard',
    icon: OverviewIcon,
    display: 'Overview',
  },
  {
    route: '/users',
    icon: UsersIcon,
    display: 'User',
  },
  {
    route: '/facilities',
    icon: FacilitiesIcon,
    display: 'Facilities',
  },
  {
    route: '/orders',
    icon: OrdersIcon,
    display: 'Orders',
    countable: true
  },
  {
    route: '/transactions',
    icon: TransactionsIcon,
    display: 'Transactions',
  },
  {
    route: '/messages',
    icon: MessagesIcon,
    display: 'Messages'
  }
];
