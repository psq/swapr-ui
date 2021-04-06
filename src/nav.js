export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Tokens',
    to: '/tokens',
    icon: 'cil-bank',
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Pairs',
    to: '/pairs',
    icon: 'cil-swap-horizontal',
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