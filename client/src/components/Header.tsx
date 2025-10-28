import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { StaffMember } from '@shared/schema';
import { Mail, Send, Github } from 'lucide-react';

interface HeaderProps {
  staff?: StaffMember;
  showCompanyDates?: boolean;
}

export function Header({ staff, showCompanyDates }: HeaderProps) {
  const { t } = useTranslation('common');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" data-testid="link-home">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md cursor-pointer transition-all" data-testid="button-home">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center">
                    <img src="/favicon.png" alt="Logo" className="w-6 h-6" />
                  </div>
                  <span className="font-display font-semibold text-lg">{t('nav.nsStaff')}</span>
                </div>
              </TooltipTrigger>
              {showCompanyDates && (
                <TooltipContent side="bottom">
                  <p className="text-sm">{t('nav.companyDates')}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </Link>

          {staff && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-3 py-1.5 rounded-full bg-card border border-card-border text-sm font-medium cursor-default hidden lg:block" data-testid={`badge-endpoint-${staff.endpoint}`}>
                  {staff.endpoint}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-2 p-1">
                  {staff.contacts.email && (
                    <div className="flex items-center gap-2 text-sm" data-testid={`text-contact-email-${staff.endpoint}`}>
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{staff.contacts.email}</span>
                    </div>
                  )}
                  {staff.contacts.telegram_channel && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={staff.contacts.telegram_channel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        data-testid={`link-contact-telegram-${staff.endpoint}`}
                      >
                        {t('contacts.telegram')}
                      </a>
                    </div>
                  )}
                  {staff.contacts.github && (
                    <div className="flex items-center gap-2 text-sm">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={staff.contacts.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                        data-testid={`link-contact-github-${staff.endpoint}`}
                      >
                        {t('contacts.github')}
                      </a>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
