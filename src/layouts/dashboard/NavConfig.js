// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22}/>;

const navConfig = [
    {
        title: 'dashboard',
        path: '/dashboard/app',
        icon: getIcon('ic:sharp-space-dashboard'),
    },
    {
        title: 'alert',
        icon: getIcon('akar-icons:triangle-alert-fill'),
        children: [
            {
                title: 'send alert',
                path: '/dashboard/alert/add',
            },
            {
                title: 'alert list',
                path: '/dashboard/alert/list',
            }
        ]
    },
    {
        title: 'location',
        icon: getIcon('fa6-solid:map-location'),
        children: [
            {
                title: 'Add Location',
                path: '/dashboard/location/add',
            },
            {
                title: 'location list',
                path: '/dashboard/location/list',
            }
        ]
    },
    {
        title: 'user',
        icon: getIcon('eva:people-fill'),
        children: [
            {
                title: 'Add user',
                path: '/dashboard/user/add',
            },
            {
                title: 'user list',
                path: '/dashboard/user',
            }
        ]
    },
];

export default navConfig;
