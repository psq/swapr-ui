export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Exchange',
    to: '/exchange',
    icon: 'cil-swap-horizontal',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pool',
    to: '/pool',
    icon: 'cil-bank',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Faucets',
    to: '/faucets',
    icon: 'cil-rain',
    badge: {
      color: 'info',
      text: 'Testnet',
    }
  },
]