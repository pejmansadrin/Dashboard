import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'کاربر نمونه',
    email: 'demo@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: import.meta.env.VITE_COMPANY_NAME?.trim() || 'زیلبر',
      logo: Command,
      plan: 'فضای کاری زیلبر',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'فضای کاری',
      items: [
        {
          title: 'داشبورد',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'وظایف',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'برنامه‌ها',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'گفتگوها',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'کاربران',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'صفحه‌ها',
      items: [
        {
          title: 'ورود و عضویت',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'خطاها',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'مدیریت',
      items: [
        {
          title: 'تنظیمات',
          icon: Settings,
          items: [
            {
              title: 'پروفایل',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'حساب کاربری',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'ظاهر',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'اعلان‌ها',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'نمایش',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'راهنما',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
